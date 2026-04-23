import axios, { AxiosInstance } from 'axios';

export class InsForgeClient {
  private client: AxiosInstance;
  private dbName: string;

  constructor(baseURL: string, apiKey: string, dbName: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
    this.dbName = dbName;
  }

  // Collections (tables) management
  async createCollection(name: string, schema: any) {
    try {
      const response = await this.client.post(`/databases/${this.dbName}/collections`, {
        name,
        schema,
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to create collection ${name}:`, error);
      throw error;
    }
  }

  async listCollections() {
    try {
      const response = await this.client.get(`/databases/${this.dbName}/collections`);
      return response.data;
    } catch (error) {
      console.error('Failed to list collections:', error);
      throw error;
    }
  }

  // Documents (records) operations
  async insertOne(collection: string, document: any) {
    try {
      const response = await this.client.post(
        `/databases/${this.dbName}/collections/${collection}/documents`,
        document
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to insert document into ${collection}:`, error);
      throw error;
    }
  }

  async findOne(collection: string, filter: any) {
    try {
      const response = await this.client.post(
        `/databases/${this.dbName}/collections/${collection}/documents/findOne`,
        { filter }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to find document in ${collection}:`, error);
      throw error;
    }
  }

  async find(collection: string, filter: any = {}, options: any = {}) {
    try {
      const response = await this.client.post(
        `/databases/${this.dbName}/collections/${collection}/documents/find`,
        { filter, ...options }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to find documents in ${collection}:`, error);
      throw error;
    }
  }

  async updateOne(collection: string, filter: any, update: any) {
    try {
      const response = await this.client.patch(
        `/databases/${this.dbName}/collections/${collection}/documents`,
        { filter, update }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update document in ${collection}:`, error);
      throw error;
    }
  }

  async deleteOne(collection: string, filter: any) {
    try {
      const response = await this.client.delete(
        `/databases/${this.dbName}/collections/${collection}/documents`,
        { data: { filter } }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to delete document in ${collection}:`, error);
      throw error;
    }
  }

  // Storage operations
  async uploadFile(file: Buffer, filename: string, contentType: string) {
    try {
      const response = await this.client.post(
        `/storage/${this.dbName}/upload`,
        file,
        {
          headers: {
            'Content-Type': contentType,
            'X-Filename': filename,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  }

  async getFileUrl(filename: string) {
    try {
      const response = await this.client.get(
        `/storage/${this.dbName}/file/${filename}`
      );
      return response.data.url;
    } catch (error) {
      console.error('Failed to get file URL:', error);
      throw error;
    }
  }
}

export let insforgeClient: InsForgeClient;

export function initializeInsForge(url: string, apiKey: string, dbName: string) {
  insforgeClient = new InsForgeClient(url, apiKey, dbName);
}