import { insforge, User, ContentItem, Settings } from './supabase'

class DatabaseService {
  // User Management
  async createUser(email: string, name: string, password: string, role: 'admin' | 'user' = 'user'): Promise<User | null> {
    try {
      const { data, error } = await insforge.auth.signUp({
        email,
        password,
        name,
        redirectTo: window.location.origin + '/settings'
      })

      if (error) throw error
      return data?.user ? {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.profile?.name || name || '',
        role: 'user',
        created_at: data.user.createdAt,
        updated_at: data.user.updatedAt || data.user.createdAt
      } : null
    } catch (error) {
      console.error('Error creating user:', error)
      return null
    }
  }

  async signIn(email: string, password: string): Promise<User | null> {
    try {
      const { data, error } = await insforge.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return data?.user ? {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.profile?.name || '',
        role: 'user',
        created_at: data.user.createdAt,
        updated_at: data.user.updatedAt || data.user.createdAt
      } : null
    } catch (error) {
      console.error('Error signing in:', error)
      return null
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data, error } = await insforge.auth.getCurrentUser()
      if (error) throw error
      return data?.user ? {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.profile?.name || '',
        role: 'user',
        created_at: data.user.createdAt,
        updated_at: data.user.updatedAt || data.user.createdAt
      } : null
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await insforge.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Content Management
  async createContentItem(item: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>): Promise<ContentItem | null> {
    try {
      const { data, error } = await insforge.database
        .from('content')
        .insert([item])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating content item:', error)
      return null
    }
  }

  async getContentItems(userId: string): Promise<ContentItem[]> {
    try {
      const { data, error } = await insforge.database
        .from('content')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching content items:', error)
      return []
    }
  }

  async updateContentItem(id: string, updates: Partial<ContentItem>): Promise<ContentItem | null> {
    try {
      const { data, error } = await insforge.database
        .from('content')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating content item:', error)
      return null
    }
  }

  async deleteContentItem(id: string): Promise<boolean> {
    try {
      const { error } = await insforge.database
        .from('content')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting content item:', error)
      return false
    }
  }

  // Settings Management
  async getUserSettings(userId: string): Promise<Settings | null> {
    try {
      const { data, error } = await insforge.database
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
      return data
    } catch (error) {
      console.error('Error fetching user settings:', error)
      return null
    }
  }

  async updateUserSettings(userId: string, settings: Partial<Settings>): Promise<Settings | null> {
    try {
      const existingSettings = await this.getUserSettings(userId)

      if (existingSettings) {
        const { data, error } = await insforge.database
          .from('user_settings')
          .update({ ...settings, updated_at: new Date().toISOString() })
          .eq('user_id', userId)
          .select()
          .single()

        if (error) throw error
        return data
      } else {
        const { data, error } = await insforge.database
          .from('user_settings')
          .insert([{ user_id: userId, ...settings }])
          .select()
          .single()

        if (error) throw error
        return data
      }
    } catch (error) {
      console.error('Error updating user settings:', error)
      return null
    }
  }

  // Sync localStorage data to database
  async syncLocalStorageToDatabase(userId: string): Promise<void> {
    try {
      // Sync saved content
      const savedContent = localStorage.getItem('roshanal_saved_content')
      if (savedContent) {
        const parsed = JSON.parse(savedContent)
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            await this.createContentItem({
              user_id: userId,
              title: item.title,
              content: item.content || item.script || item.plan || '',
              type: item.type,
              status: item.status,
              tags: item.tags || [],
              metadata: item
            })
          }
        }
      }

      // Sync settings
      const settingsData = localStorage.getItem('roshanal_settings')
      if (settingsData) {
        const parsed = JSON.parse(settingsData)
        await this.updateUserSettings(userId, parsed)
      }
    } catch (error) {
      console.error('Error syncing localStorage to database:', error)
    }
  }
}

export const dbService = new DatabaseService()