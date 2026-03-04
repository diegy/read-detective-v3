import Redis from 'ioredis';

export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

export async function setupRedis() {
  try {
    await redis.ping();
    console.log('Redis connection established');
  } catch (error) {
    console.error('Redis connection failed:', error);
    throw error;
  }
}
