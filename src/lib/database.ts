import { supabase, User, ContentItem, Settings } from './supabase'

class DatabaseService {
  // User Management
  async createUser(email: string, name: string, password: string, role: 'admin' | 'user' = 'user'): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      })

      if (error) throw error
      return data.user ? {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || '',
        role: data.user.user_metadata?.role || 'user',
        created_at: data.user.created_at,
        updated_at: data.user.updated_at || data.user.created_at
      } : null
    } catch (error) {
      console.error('Error creating user:', error)
      return null
    }
  }

  async signIn(email: string, password: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return data.user ? {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || '',
        role: data.user.user_metadata?.role || 'user',
        created_at: data.user.created_at,
        updated_at: data.user.updated_at || data.user.created_at
      } : null
    } catch (error) {
      console.error('Error signing in:', error)
      return null
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user ? {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || '',
        role: user.user_metadata?.role || 'user',
        created_at: user.created_at,
        updated_at: user.updated_at || user.created_at
      } : null
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Content Management
  async createContentItem(item: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>): Promise<ContentItem | null> {
    try {
      const { data, error } = await supabase
        .from('content_items')
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
      const { data, error } = await supabase
        .from('content_items')
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
      const { data, error } = await supabase
        .from('content_items')
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
      const { error } = await supabase
        .from('content_items')
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
      const { data, error } = await supabase
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
        const { data, error } = await supabase
          .from('user_settings')
          .update({ ...settings, updated_at: new Date().toISOString() })
          .eq('user_id', userId)
          .select()
          .single()

        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
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