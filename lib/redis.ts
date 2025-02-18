import Redis from 'ioredis';

let redis: Redis|any;

try {
  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  });
  console.log('Redis connection established');
} catch (error) {
  console.error('Failed to connect to Redis:', error);
}

export default redis;
