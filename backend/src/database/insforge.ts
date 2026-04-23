import axios, { AxiosInstance } from 'axios';
import { promises as fs } from 'fs';
import path from 'path';

// Simple in-memory database for development
class InMemoryDatabase {
  private data: Map<string, any[]> = new Map();
  private filePath: string;

  constructor(dbName: string) {
    this.filePath = path.join(process.cwd(), `${dbName}.json`);
    this.loadFromFile();
  }

  private async loadFromFile() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(data);
      this.data = new Map(Object.entries(parsed));
    } catch (error) {
      // File doesn't exist or is invalid, start with empty database
      this.data = new Map();
    }
  }

  private async saveToFile() {
    const data = Object.fromEntries(this.data);
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async createCollection(name: string, schema: any) {
    if (!this.data.has(name)) {
      this.data.set(name, []);
      await this.saveToFile();
      console.log(`✅ Created collection: ${name}`);
    } else {
      console.log(`⚠️  Collection ${name} already exists`);
    }
    return { success: true };
  }

  async find(collection: string, filter: any = {}, options: any = {}) {
    let results = this.data.get(collection) || [];

    // Simple filtering
    if (Object.keys(filter).length > 0) {
      results = results.filter(item => {
        return Object.entries(filter).every(([key, value]) => {
          if (key === '$or') {
            return (value as any[]).some(orFilter => {
              return Object.entries(orFilter).every(([k, v]) => item[k] === v);
            });
          }
          return item[key] === value;
        });
      });
    }

    // Sorting
    if (options.sort) {
      const [field, direction] = Object.entries(options.sort)[0];
      results.sort((a, b) => {
        if (direction === -1) {
          return new Date(b[field]).getTime() - new Date(a[field]).getTime();
        }
        return new Date(a[field]).getTime() - new Date(b[field]).getTime();
      });
    }

    // Pagination
    if (options.skip || options.limit) {
      const skip = options.skip || 0;
      const limit = options.limit || results.length;
      results = results.slice(skip, skip + limit);
    }

    return results;
  }

  async findOne(collection: string, filter: any = {}) {
    const results = await this.find(collection, filter);
    return results[0] || null;
  }

  async insertOne(collection: string, document: any) {
    const collectionData = this.data.get(collection) || [];
    collectionData.push(document);
    this.data.set(collection, collectionData);
    await this.saveToFile();
    return document;
  }

  async updateOne(collection: string, filter: any, update: any) {
    const collectionData = this.data.get(collection) || [];
    const index = collectionData.findIndex(item =>
      Object.entries(filter).every(([key, value]) => item[key] === value)
    );

    if (index !== -1) {
      collectionData[index] = { ...collectionData[index], ...update };
      this.data.set(collection, collectionData);
      await this.saveToFile();
      return { modifiedCount: 1 };
    }

    return { modifiedCount: 0 };
  }

  async deleteOne(collection: string, filter: any) {
    const collectionData = this.data.get(collection) || [];
    const newData = collectionData.filter(item =>
      !Object.entries(filter).every(([key, value]) => item[key] === value)
    );

    if (newData.length !== collectionData.length) {
      this.data.set(collection, newData);
      await this.saveToFile();
      return { deletedCount: 1 };
    }

    return { deletedCount: 0 };
  }

  async listCollections() {
    return Array.from(this.data.keys()).map(name => ({ name }));
  }
}

export class InsForgeClient {
  private client: AxiosInstance;
  private dbName: string;
  private inMemoryDb: InMemoryDatabase;

  constructor(baseURL: string, apiKey: string, dbName: string) {
    // Try to use real InsForge first
    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
    this.dbName = dbName;

    // Fallback to in-memory database
    this.inMemoryDb = new InMemoryDatabase(dbName);
  }

  // Collections (tables) management
  async createCollection(name: string, schema: any) {
    try {
      // Try real InsForge first
      const response = await this.client.post(`/databases/${this.dbName}/collections`, {
        name,
        schema,
      });
      return response.data;
    } catch (error) {
      // Fallback to in-memory database
      console.log('⚠️  InsForge unavailable, using in-memory database');
      return this.inMemoryDb.createCollection(name, schema);
    }
  }

  async listCollections() {
    try {
      const response = await this.client.get(`/databases/${this.dbName}/collections`);
      return response.data;
    } catch (error) {
      console.log('⚠️  InsForge unavailable, using in-memory database');
      return this.inMemoryDb.listCollections();
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
      console.log('⚠️  InsForge unavailable, using in-memory database');
      return this.inMemoryDb.insertOne(collection, document);
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
      console.log('⚠️  InsForge unavailable, using in-memory database');
      return this.inMemoryDb.findOne(collection, filter);
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
      console.log('⚠️  InsForge unavailable, using in-memory database');
      return this.inMemoryDb.find(collection, filter, options);
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
      console.log('⚠️  InsForge unavailable, using in-memory database');
      return this.inMemoryDb.updateOne(collection, filter, update);
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
      console.log('⚠️  InsForge unavailable, using in-memory database');
      return this.inMemoryDb.deleteOne(collection, filter);
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