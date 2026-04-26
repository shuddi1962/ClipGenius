import { Queue, Worker } from 'bullmq';
import { insforgeClient } from '../database/insforge.js';

export interface JobData {
  [key: string]: any;
}

export class QueueService {
  private queues: Map<string, Queue> = new Map();
  private workers: Map<string, Worker> = new Map();

  constructor(redisUrl?: string) {
    if (redisUrl) {
      this.initializeQueues(redisUrl);
    }
  }

  private initializeQueues(redisUrl: string) {
    // Model sync queue
    this.createQueue('model-sync', redisUrl, async (job) => {
      const { provider } = job.data;

      if (provider === 'openrouter') {
        await this.syncOpenRouterModels();
      } else if (provider === 'kie') {
        await this.syncKieModels();
      }
    });

    // Email queue
    this.createQueue('email', redisUrl, async (job) => {
      const { to, subject, html, text } = job.data;
      await this.sendEmail(to, subject, html, text);
    });

    // Background processing queue
    this.createQueue('background', redisUrl, async (job) => {
      const { type, data } = job.data;

      switch (type) {
        case 'sync-models':
          await this.handleModelSync(data);
          break;
        case 'send-email':
          await this.handleSendEmail(data);
          break;
        default:
          console.log(`Unknown job type: ${type}`);
      }
    });
  }

  private createQueue(name: string, redisUrl: string, processor: (job: any) => Promise<void>) {
    // Create queue
    const queue = new Queue(name, {
      connection: { url: redisUrl },
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 100,
      },
    });

    // Create worker
    const worker = new Worker(name, processor, {
      connection: { url: redisUrl },
      concurrency: 5,
    });

    worker.on('completed', (job) => {
      console.log(`Job ${job.id} in queue ${name} completed`);
    });

    worker.on('failed', (job, err) => {
      if (job) {
        console.error(`Job ${job.id} in queue ${name} failed:`, err);
      } else {
        console.error(`Job in queue ${name} failed (unknown job):`, err);
      }
    });

    this.queues.set(name, queue);
    this.workers.set(name, worker);
  }

  // Add job to queue
  async addJob(queueName: string, jobName: string, data: JobData, options: any = {}) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    return await queue.add(jobName, data, options);
  }

  // Model sync methods
  private async syncOpenRouterModels() {
    try {
      const { default: axios } = await import('axios');

      // Get API key from vault
      const apiKey = await this.getDecryptedApiKey('openrouter');
      if (!apiKey) {
        console.log('OpenRouter API key not found, skipping sync');
        return;
      }

      const response = await axios.get('https://openrouter.ai/api/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
        timeout: 30000,
      });

      // Store in platform settings
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

      console.log(`Synced ${response.data.data.length} OpenRouter models`);
    } catch (error) {
      console.error('Failed to sync OpenRouter models:', error);
    }
  }

  private async syncKieModels() {
    try {
      const { default: axios } = await import('axios');

      // Get API key from vault
      const apiKey = await this.getDecryptedApiKey('kie_ai');
      if (!apiKey) {
        console.log('Kie.ai API key not found, skipping sync');
        return;
      }

      const response = await axios.get('https://api.kie.ai/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
        timeout: 30000,
      });

      // Store in platform settings
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

      console.log('Synced Kie.ai models');
    } catch (error) {
      console.error('Failed to sync Kie.ai models:', error);
    }
  }

  private async handleModelSync(data: JobData) {
    const { provider } = data;

    if (provider === 'openrouter') {
      await this.syncOpenRouterModels();
    } else if (provider === 'kie') {
      await this.syncKieModels();
    }
  }

  // Email methods
  private async sendEmail(to: string, subject: string, html?: string, text?: string) {
    try {
      const { default: nodemailer } = await import('nodemailer');

      // Get SMTP config from environment
      const smtpHost = process.env.SYSTEM_SMTP_HOST;
      const smtpPort = parseInt(process.env.SYSTEM_SMTP_PORT || '587');
      const smtpUser = process.env.SYSTEM_SMTP_USER;
      const smtpPass = process.env.SYSTEM_SMTP_PASS;
      const fromEmail = process.env.SYSTEM_FROM_EMAIL || 'noreply@nexus.app';

      if (!smtpHost || !smtpUser || !smtpPass) {
        console.log('SMTP not configured, skipping email send');
        return;
      }

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: fromEmail,
        to,
        subject,
        text,
        html,
      });

      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  private async handleSendEmail(data: JobData) {
    const { to, subject, html, text } = data;
    await this.sendEmail(to, subject, html, text);
  }

  // Helper to get decrypted API key
  private async getDecryptedApiKey(provider: string): Promise<string | null> {
    const vaultService = (global as any).vaultService;
    if (vaultService) {
      return await vaultService.getDecryptedKey(provider);
    }
    return null;
  }

  // Graceful shutdown
  async close() {
    for (const [name, queue] of this.queues) {
      await queue.close();
    }

    for (const [name, worker] of this.workers) {
      await worker.close();
    }
  }
}