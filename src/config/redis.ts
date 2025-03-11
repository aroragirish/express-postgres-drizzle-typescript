import { createClient } from 'redis';
import logger from '../utils/logger';

let redisClient: ReturnType<typeof createClient> | null = null;
let isRedisEnabled = false;

// Initialize Redis only if explicitly enabled
export async function initRedis() {
  // Check if Redis is explicitly enabled via environment variable
  const redisEnabled = process.env.ENABLE_REDIS === 'true';
  
  if (!redisEnabled) {
    isRedisEnabled = false;
    logger.info('Redis caching is disabled by default');
    return;
  }

  // Only attempt to connect if REDIS_URL is provided and not empty
  if (!process.env.REDIS_URL || process.env.REDIS_URL.trim() === '') {
    isRedisEnabled = false;
    logger.info('Redis caching is disabled - no Redis URL provided');
    return;
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
      isRedisEnabled = false;
    });

    redisClient.on('connect', () => {
      logger.info('Redis Client Connected');
      isRedisEnabled = true;
    });

    await redisClient.connect();
  } catch (error) {
    logger.warn('Failed to connect to Redis. Redis caching will be disabled.');
    isRedisEnabled = false;
    redisClient = null;
  }
}

export async function getRedisClient() {
  if (!isRedisEnabled || !redisClient) {
    return null;
  }
  return redisClient;
}

export async function closeRedis() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    isRedisEnabled = false;
  }
}

// Cache helper functions with fallback
export async function getCache<T>(key: string): Promise<T | null> {
  if (!isRedisEnabled) return null;
  
  try {
    const client = await getRedisClient();
    if (!client) return null;

    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.warn('Cache get failed:', error);
    return null;
  }
}

export async function setCache(key: string, value: any, ttl?: number): Promise<void> {
  if (!isRedisEnabled) return;
  
  try {
    const client = await getRedisClient();
    if (!client) return;

    if (ttl) {
      await client.setEx(key, ttl, JSON.stringify(value));
    } else {
      await client.set(key, JSON.stringify(value));
    }
  } catch (error) {
    logger.warn('Cache set failed:', error);
  }
}

export async function deleteCache(key: string): Promise<void> {
  if (!isRedisEnabled) return;
  
  try {
    const client = await getRedisClient();
    if (!client) return;

    await client.del(key);
  } catch (error) {
    logger.warn('Cache delete failed:', error);
  }
} 