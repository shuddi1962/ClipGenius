import { createClient } from '@insforge/sdk'

export class InsForgeClientWrapper {
  private client: any
  private dbName: string
  private baseURL: string
  private apiKey: string

  constructor(baseURL: string, apiKey: string, dbName: string) {
    this.client = createClient({ url: baseURL, apiKey })
    this.baseURL = baseURL
    this.apiKey = apiKey
    this.dbName = dbName
  }

  async createCollection(name: string, schema: any) {
    try {
      const response = await fetch(`${this.baseURL}/databases/${this.dbName}/collections`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, schema })
      })
      const data = await response.json()
      if (!response.ok) {
        console.log(`Collection ${name} creation:`, response.status, data)
        return { success: false, data: null, error: data }
      }
      return { success: true, data, error: null }
    } catch (error) {
      console.error(`Failed to create collection ${name}:`, error)
      return { success: false, data: null, error }
    }
  }

  async listCollections() {
    try {
      const result = await this.client.from('_collections').select('*')
      return { data: result, error: null }
    } catch (error) {
      console.error('Failed to list collections:', error)
      return { data: [], error }
    }
  }

  async insertOne(collection: string, document: any) {
    try {
      const result = await this.client.from(collection).insert(document)
      return result
    } catch (error) {
      console.error('Insert failed:', error)
      return { data: null, error }
    }
  }

  async findOne(collection: string, filter: any): Promise<any> {
    try {
      let query = this.client.from(collection).select('*')
      Object.keys(filter).forEach((key: string) => {
        query = query.eq(key, filter[key])
      })
      const result = await query.single()
      return result.data
    } catch (error) {
      console.error('FindOne failed:', error)
      return null
    }
  }

  async find(collection: string, filter: any = {}, options: any = {}): Promise<any[]> {
    try {
      let query = this.client.from(collection).select('*')
      Object.keys(filter).forEach((key: string) => {
        query = query.eq(key, filter[key])
      })
      if (options.sort) {
        const [field, direction] = Object.entries(options.sort)[0] as [string, number]
        query = query.order(field, direction !== -1)
      }
      if (options.limit) {
        query = query.limit(options.limit)
      }
      const result = await query
      return result.data || []
    } catch (error) {
      console.error('Find failed:', error)
      return []
    }
  }

  async updateOne(collection: string, filter: any, update: any, options: any = {}): Promise<{ modifiedCount: number }> {
    try {
      if (options.upsert) {
        const existing = await this.findOne(collection, filter)
        if (existing) {
          let query = this.client.from(collection).update(update)
          Object.keys(filter).forEach((key: string) => {
            query = query.eq(key, filter[key])
          })
          const result = await query
          return { modifiedCount: result.data ? 1 : 0 }
        } else {
          const merged = { ...filter, ...update }
          await this.client.from(collection).insert(merged)
          return { modifiedCount: 1 }
        }
      } else {
        let query = this.client.from(collection).update(update)
        Object.keys(filter).forEach((key: string) => {
          query = query.eq(key, filter[key])
        })
        const result = await query
        return { modifiedCount: result.data ? 1 : 0 }
      }
    } catch (error) {
      console.error('Update failed:', error)
      return { modifiedCount: 0 }
    }
  }

  async deleteOne(collection: string, filter: any): Promise<{ deletedCount: number }> {
    try {
      let query = this.client.from(collection).delete()
      Object.keys(filter).forEach((key: string) => {
        query = query.eq(key, filter[key])
      })
      const result = await query
      return { deletedCount: result.data ? 1 : 0 }
    } catch (error) {
      console.error('Delete failed:', error)
      return { deletedCount: 0 }
    }
  }
}

export let insforgeClient: InsForgeClientWrapper

export function initializeInsForge(url: string, apiKey: string, dbName: string) {
  insforgeClient = new InsForgeClientWrapper(url, apiKey, dbName)
}
