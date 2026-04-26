import axios, { AxiosResponse } from 'axios';
import { z } from 'zod';
import { insforgeClient } from '../database/insforge.js';
import { EncryptionService } from './encryption.js';

export interface APIKeyEntry {
  id: string;
  provider: string;
  encrypted_key: string;
  label: string;
  category: string;
  added_by: string;
  last_tested_at?: Date;
  test_status: 'untested' | 'testing' | 'active' | 'invalid' | 'expired';
  usage_this_month: number;
  active: boolean;
}

export interface APIKeyConfig {
  provider: string;
  testEndpoint: string;
  testMethod: 'GET' | 'POST';
  testHeaders?: Record<string, string>;
  testBody?: any;
  expectedStatus?: number;
}

const API_KEY_CONFIGS: Record<string, APIKeyConfig> = {
  'openrouter': {
    provider: 'openrouter',
    testEndpoint: 'https://openrouter.ai/api/v1/models',
    testMethod: 'GET',
    testHeaders: { Authorization: 'Bearer {KEY}' },
    expectedStatus: 200,
  },
  'kie_ai': {
    provider: 'kie_ai',
    testEndpoint: 'https://api.kie.ai/v1/models',
    testMethod: 'GET',
    testHeaders: { Authorization: 'Bearer {KEY}' },
    expectedStatus: 200,
  },
  'dataforseo': {
    provider: 'dataforseo',
    testEndpoint: 'https://api.dataforseo.com/v3/appendix/user_data',
    testMethod: 'GET',
    expectedStatus: 200,
  },
  'mailgun': {
    provider: 'mailgun',
    testEndpoint: 'https://api.mailgun.net/v3/domains',
    testMethod: 'GET',
    testHeaders: { Authorization: 'Basic {BASE64_KEY}' },
    expectedStatus: 200,
  },
  'sendgrid': {
    provider: 'sendgrid',
    testEndpoint: 'https://api.sendgrid.com/v3/user/email',
    testMethod: 'GET',
    testHeaders: { Authorization: 'Bearer {KEY}' },
    expectedStatus: 200,
  },
  'twilio': {
    provider: 'twilio',
    testEndpoint: 'https://api.twilio.com/2010-04-01/Accounts/{ACCOUNT_SID}/Balance.json',
    testMethod: 'GET',
    testHeaders: { Authorization: 'Basic {BASE64_KEY}' },
    expectedStatus: 200,
  },
  'stripe': {
    provider: 'stripe',
    testEndpoint: 'https://api.stripe.com/v1/balance',
    testMethod: 'GET',
    testHeaders: { Authorization: 'Bearer {KEY}' },
    expectedStatus: 200,
  },
};

export class APIKeysVaultService {
  private encryptionService: EncryptionService;

  constructor(encryptionKey: string, ivLength: number = 16) {
    this.encryptionService = new EncryptionService(encryptionKey, ivLength);
  }

  // CRUD operations
  async createKey(data: {
    provider: string;
    key: string;
    label: string;
    category: string;
    added_by: string;
  }): Promise<APIKeyEntry> {
    const id = this.generateId();
    const encryptedKey = this.encryptionService.encrypt(data.key);

    const keyEntry: APIKeyEntry = {
      id,
      provider: data.provider,
      encrypted_key: encryptedKey,
      label: data.label,
      category: data.category,
      added_by: data.added_by,
      test_status: 'untested',
      usage_this_month: 0,
      active: true,
    };

    await insforgeClient.insertOne('api_keys_vault', keyEntry);

    return keyEntry;
  }

  async getKeys(): Promise<APIKeyEntry[]> {
    const keys = await insforgeClient.find('api_keys_vault', {});
    return keys.map(key => ({
      ...key,
      // Remove encrypted_key from response
      encrypted_key: undefined,
    })) as APIKeyEntry[];
  }

  async getKeyById(id: string): Promise<APIKeyEntry | null> {
    const key = await insforgeClient.findOne('api_keys_vault', { id });
    if (!key) return null;

    return {
      ...key,
      encrypted_key: undefined,
    } as APIKeyEntry;
  }

  async updateKey(id: string, updates: Partial<APIKeyEntry>): Promise<void> {
    await insforgeClient.updateOne('api_keys_vault', { id }, updates);
  }

  async deleteKey(id: string): Promise<void> {
    await insforgeClient.deleteOne('api_keys_vault', { id });
  }

  // Get decrypted key for internal use
  async getDecryptedKey(provider: string): Promise<string | null> {
    const key = await insforgeClient.findOne('api_keys_vault', {
      provider,
      active: true,
    });

    if (!key) return null;

    try {
      return this.encryptionService.decrypt(key.encrypted_key);
    } catch {
      return null;
    }
  }

  // Test connection
  async testConnection(provider: string): Promise<{ success: boolean; error?: string }> {
    const config = API_KEY_CONFIGS[provider];
    if (!config) {
      return { success: false, error: 'Unknown provider' };
    }

    const key = await this.getDecryptedKey(provider);
    if (!key) {
      return { success: false, error: 'API key not found' };
    }

    try {
      let url = config.testEndpoint;
      let headers = { ...config.testHeaders };
      let data = config.testBody;

      // Replace placeholders
      if (provider === 'twilio') {
        const accountSid = key.split(':')[0];
        url = url.replace('{ACCOUNT_SID}', accountSid);
        const base64Key = Buffer.from(`${accountSid}:${key.split(':')[1]}`).toString('base64');
        headers.Authorization = headers.Authorization?.replace('{BASE64_KEY}', base64Key);
      } else if (headers.Authorization?.includes('{BASE64_KEY}')) {
        const base64Key = Buffer.from(key).toString('base64');
        headers.Authorization = headers.Authorization.replace('{BASE64_KEY}', base64Key);
      } else if (headers.Authorization?.includes('{KEY}')) {
        headers.Authorization = headers.Authorization.replace('{KEY}', key);
      }

      const response: AxiosResponse = await axios({
        method: config.testMethod,
        url,
        headers,
        data,
        timeout: 10000,
      });

      const success = response.status === (config.expectedStatus || 200);

      // Update test status
      const keyEntry = await insforgeClient.findOne('api_keys_vault', { provider, active: true });
      if (keyEntry) {
        await this.updateKey(keyEntry.id, {
          test_status: success ? 'active' : 'invalid',
          last_tested_at: new Date(),
        });
      }

      return { success };
    } catch (error: any) {
      // Update test status
      const keyEntry = await insforgeClient.findOne('api_keys_vault', { provider, active: true });
      if (keyEntry) {
        await this.updateKey(keyEntry.id, {
          test_status: 'invalid',
          last_tested_at: new Date(),
        });
      }

      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Connection failed',
      };
    }
  }

  // Track usage
  async trackUsage(provider: string, tokensUsed: number, costUsd: number): Promise<void> {
    const key = await insforgeClient.findOne('api_keys_vault', {
      provider,
      active: true,
    });

    if (key) {
      await this.updateKey(key.id, {
        usage_this_month: (key.usage_this_month || 0) + 1,
      });
    }
  }

  private generateId(): string {
    return require('crypto').randomBytes(16).toString('hex');
  }
}