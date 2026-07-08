import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('connect', () => {
  console.log('✅ Redis Connected');
});

redisClient.on('reconnecting', () => {
  console.log('🔄 Redis Reconnecting...');
});

redisClient.on('error', (error) => {
  console.error('❌ Redis Error:', error.message);
});

export default redisClient;