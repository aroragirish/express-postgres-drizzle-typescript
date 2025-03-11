import { createClient, RedisClientType } from 'redis';

export class RedisService {
  private client: RedisClientType | null = null;
  private isConnected = false;

  constructor() {
    try {
      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      }) as RedisClientType;

      if (this.client) {
        this.client.on('error', (err) => {
          console.error('Redis Client Error:', err);
          this.isConnected = false;
        });

        this.client.on('connect', () => {
          console.log('Redis Client Connected');
          this.isConnected = true;
        });

        this.client.connect().catch(console.error);
      }
    } catch (error) {
      console.error('Redis Client Creation Error:', error);
      this.isConnected = false;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.isConnected || !this.client) return;
    try {
      if (ttl) {
        await this.client.set(key, value, { EX: ttl });
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      console.error('Redis Set Error:', error);
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.isConnected || !this.client) return null;
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error('Redis Get Error:', error);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected || !this.client) return;
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Redis Delete Error:', error);
    }
  }
} 