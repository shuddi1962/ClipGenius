import axios from 'axios';
import { insforgeClient } from '../database/insforge.js';
import { APIKeysVaultService } from '../api-keys/vault-service.js';

export class ModelSyncService {
  private vaultService: APIKeysVaultService;

  constructor(vaultService: APIKeysVaultService) {
    this.vaultService = vaultService;
  }

  async syncOpenRouterModels(): Promise<void> {
    try {
      console.log('🔄 Syncing OpenRouter models...');

      const apiKey = await this.vaultService.getDecryptedKey('openrouter');
      if (!apiKey) {
        console.log('⚠️  OpenRouter API key not configured, skipping sync');
        return;
      }

      const response = await axios.get('https://openrouter.ai/api/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
        timeout: 30000,
      });

      // Store models in platform settings
      await insforgeClient.updateOne(
        'platform_settings',
        { key: 'openrouter_models' },
        {
          key: 'openrouter_models',
          value: JSON.stringify(response.data.data),
          updated_by: 'system',
          updated_at: new Date(),
        },
        { upsert: true }
      );

      console.log(`✅ Synced ${response.data.data.length} OpenRouter models`);
    } catch (error: any) {
      console.error('❌ Failed to sync OpenRouter models:', error.message);
      throw error;
    }
  }

  async syncKieModels(): Promise<void> {
    try {
      console.log('🔄 Syncing Kie.ai models...');

      const apiKey = await this.vaultService.getDecryptedKey('kie_ai');
      if (!apiKey) {
        console.log('⚠️  Kie.ai API key not configured, skipping sync');
        return;
      }

      const response = await axios.get('https://api.kie.ai/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
        timeout: 30000,
      });

      // Store models in platform settings
      await insforgeClient.updateOne(
        'platform_settings',
        { key: 'kie_models' },
        {
          key: 'kie_models',
          value: JSON.stringify(response.data),
          updated_by: 'system',
          updated_at: new Date(),
        },
        { upsert: true }
      );

      console.log('✅ Synced Kie.ai models');
    } catch (error: any) {
      console.error('❌ Failed to sync Kie.ai models:', error.message);
      throw error;
    }
  }

  async getOpenRouterModels(): Promise<any[]> {
    try {
      const setting = await insforgeClient.findOne('platform_settings', {
        key: 'openrouter_models',
      });

      if (!setting) {
        // Fallback to sync if no cached data
        await this.syncOpenRouterModels();
        return this.getOpenRouterModels();
      }

      return JSON.parse(setting.value);
    } catch (error) {
      console.error('Failed to get OpenRouter models:', error);
      return [];
    }
  }

  async getKieModels(): Promise<any> {
    try {
      const setting = await insforgeClient.findOne('platform_settings', {
        key: 'kie_models',
      });

      if (!setting) {
        // Fallback to sync if no cached data
        await this.syncKieModels();
        return this.getKieModels();
      }

      return JSON.parse(setting.value);
    } catch (error) {
      console.error('Failed to get Kie models:', error);
      return { image: [], video: [], music: [] };
    }
  }

  // Get models by type for frontend consumption
  async getModelsByType(type: 'llm' | 'image' | 'video' | 'music'): Promise<any[]> {
    switch (type) {
      case 'llm':
        const openRouterModels = await this.getOpenRouterModels();
        return openRouterModels.map(model => ({
          id: model.id,
          name: model.name || model.id,
          context_length: model.context_length,
          pricing: model.pricing,
          capabilities: ['text-generation'],
          provider: 'openrouter',
        }));

      case 'image':
      case 'video':
      case 'music':
        const kieModels = await this.getKieModels();
        return kieModels[type]?.map((model: any) => ({
          id: model.id,
          name: model.name,
          capabilities: [type],
          provider: 'kie',
          ...model,
        })) || [];

      default:
        return [];
    }
  }
}