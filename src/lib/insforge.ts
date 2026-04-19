// InsForge.dev client configuration
// This is a placeholder - in a real implementation, this would connect to InsForge.dev

export interface User {
  id: string
  email: string
  name?: string
  role?: 'client' | 'admin'
}

export interface AuthUser {
  user: User
}

export interface AuthResponse {
  data: {
    user: User | null
    session?: any
  }
  error?: any
}

export interface DatabaseQuery {
  from: (table: string) => DatabaseTable
}

export interface DatabaseTable extends Promise<{ data: any, error: any }> {
  select: (columns?: string) => DatabaseTable
  insert: (data: any) => DatabaseTable
  update: (data: any) => DatabaseTable
  upsert: (data: any) => DatabaseTable
  delete: () => DatabaseTable
  eq: (column: string, value: any) => DatabaseTable
  gte: (column: string, value: any) => DatabaseTable
  in: (column: string, values: any[]) => DatabaseTable
  single: () => Promise<{ data: any, error: any }>
  order: (column: string, options?: any) => DatabaseTable
  limit: (count: number) => DatabaseTable
}

// Mock InsForge client - replace with real InsForge SDK
class MockInsForgeClient {
  auth = {
    getUser: async (): Promise<AuthResponse> => {
      // Mock current user
      return {
        data: {
          user: {
            id: 'user_1',
            email: 'user@clipgenius.com',
            name: 'Demo User',
            role: 'client'
          }
        }
      }
    },
    getCurrentUser: async (): Promise<AuthResponse> => {
      // Mock current user
      return {
        data: {
          user: {
            id: 'user_1',
            email: 'user@clipgenius.com',
            name: 'Demo User',
            role: 'client'
          }
        }
      }
    },
    signInWithPassword: async (credentials: any): Promise<AuthResponse> => {
      // Mock login
      return {
        data: {
          user: {
            id: 'user_1',
            email: credentials.email,
            name: 'Demo User',
            role: 'client'
          }
        }
      }
    },
    signUp: async (credentials: any): Promise<AuthResponse> => {
      // Mock signup
      return {
        data: {
          user: {
            id: 'user_1',
            email: credentials.email,
            name: 'Demo User',
            role: 'client'
          }
        }
      }
    },
    signInWithOAuth: async (options: any): Promise<AuthResponse> => {
      // Mock OAuth login
      return {
        data: {
          user: {
            id: 'user_1',
            email: 'user@clipgenius.com',
            name: 'Demo User',
            role: 'client'
          }
        }
      }
    }
  }

  from = (table: string): MockDatabaseTable => {
    return new MockDatabaseTable(table)
  }
}

class MockDatabaseTable {
  private queryType: 'select' | 'insert' | 'update' | 'upsert' | 'delete' = 'select'
  private isSingle = false
  private filters: any = {}
  private insertData: any = null
  private updateData: any = null
  private upsertData: any = null
  private promise: Promise<{ data: any, error: any }>

  constructor(private table: string) {
    this.promise = this.execute()
  }

  select(columns?: string): MockDatabaseTable {
    this.queryType = 'select'
    return this
  }

  insert(data: any): MockDatabaseTable {
    this.queryType = 'insert'
    this.insertData = data
    return this
  }

  update(data: any): MockDatabaseTable {
    this.queryType = 'update'
    this.updateData = data
    return this
  }

  upsert(data: any): MockDatabaseTable {
    this.queryType = 'upsert'
    this.upsertData = data
    return this
  }

  delete(): MockDatabaseTable {
    this.queryType = 'delete'
    return this
  }

  eq(column: string, value: any): MockDatabaseTable {
    this.filters[column] = { op: 'eq', value }
    return this
  }

  gte(column: string, value: any): MockDatabaseTable {
    this.filters[column] = { op: 'gte', value }
    return this
  }

  in(column: string, values: any[]): MockDatabaseTable {
    this.filters[column] = { op: 'in', value: values }
    return this
  }

  order(column: string, options?: any): MockDatabaseTable {
    return this
  }

  limit(count: number): MockDatabaseTable {
    return this
  }

  single(): Promise<{ data: any, error: any }> {
    this.isSingle = true
    return this.promise
  }

  // Promise methods
  then<T1 = { data: any, error: any }, T2 = never>(
    onfulfilled?: ((value: { data: any, error: any }) => T1 | PromiseLike<T1>) | null,
    onrejected?: ((reason: any) => T2 | PromiseLike<T2>) | null
  ): Promise<T1 | T2> {
    return this.promise.then(onfulfilled, onrejected)
  }

  catch<T = never>(onrejected?: ((reason: any) => T | PromiseLike<T>) | null): Promise<{ data: any, error: any } | T> {
    return this.promise.catch(onrejected)
  }

  finally(onfinally?: (() => void) | null): Promise<{ data: any, error: any }> {
    return this.promise.finally(onfinally)
  }

  private async execute(): Promise<{ data: any, error: any }> {
    try {
      let result: any = null

      switch (this.queryType) {
        case 'select':
          result = this.getMockData()
          break
        case 'insert':
          result = { ...this.insertData, id: `${this.table}_${Date.now()}` }
          break
        case 'update':
          result = this.updateData
          break
        case 'upsert':
          result = { ...this.upsertData, id: `${this.table}_${Date.now()}` }
          break
        case 'delete':
          result = null
          break
      }

      return { data: result, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  private getMockData(): any {
    // Return mock data based on table and filters
    switch (this.table) {
      case 'workspaces':
        return {
          id: 'workspace_1',
          user_id: 'user_1',
          business_name: 'Demo Business',
          business_profile_json: {
            industry: 'Technology',
            description: 'Demo business description'
          }
        }
      case 'leads':
        if (this.filters.id?.op === 'in') {
          // Return array of leads
          return this.filters.id.value.map((id: string) => ({
            id,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            phone: '+1234567890',
            company: 'Example Corp',
            score: 85,
            tier: 'hot',
            status: 'qualified',
            source: 'website'
          }))
        }
        return {
          id: 'lead_1',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          company: 'Example Corp',
          score: 85,
          tier: 'hot',
          status: 'qualified',
          source: 'website'
        }
      case 'campaigns':
        return {
          id: 'campaign_1',
          name: 'Welcome Campaign',
          type: 'email',
          status: 'draft',
          template_id: 'template_1',
          lead_list_id: 'list_1',
          stats: { sent: 0, opened: 0, clicked: 0 }
        }
      case 'templates':
        return {
          id: 'template_1',
          name: 'Welcome Email',
          channel: 'email',
          subject: 'Welcome to ClipGenius',
          body_text: 'Welcome to our service!'
        }
      case 'lead_lists':
        return {
          id: 'list_1',
          name: 'Hot Leads',
          lead_ids: ['lead_1']
        }
      case 'connected_accounts':
        return {
          id: 'account_1',
          platform: 'instagram',
          account_name: '@demoaccount',
          status: 'connected'
        }
      case 'scheduled_posts':
        return {
          id: 'post_1',
          platform: 'instagram',
          content: 'Demo post content',
          status: 'scheduled'
        }
      case 'voice_agents':
        return {
          id: 'agent_1',
          name: 'Support Agent',
          status: 'active'
        }
      case 'competitors':
        return {
          id: 'comp_1',
          name: 'Competitor Inc',
          website: 'competitor.com',
          analysis_json: {}
        }
      case 'workflows':
        return {
          id: 'workflow_1',
          name: 'Lead Nurture',
          active: true
        }
      case 'user_settings':
        return {
          id: 'settings_1',
          user_id: 'user_1',
          company_name: 'Demo Business'
        }
      case 'products':
        return {
          id: 'product_1',
          name: 'Demo Product',
          price: 99.99
        }
      case 'campaign_logs':
        // For insert operations
        return null
      case 'call_logs':
        return null
      default:
        return null
    }
  }
}

export const insforge = new MockInsForgeClient()

// Server client for API routes
export function createServerClient() {
  return insforge
}

// Legacy compatibility
export const supabase = insforge