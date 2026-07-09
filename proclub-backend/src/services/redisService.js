import redisClient from '../config/redis.js';

class RedisService {
  async connect() {
    if (!redisClient.isOpen) {
      try {
        await redisClient.connect();
      } catch (error) {
        console.warn('Redis connection failed:', error.message);
      }
    }
  }

  async disconnect() {
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
  }

  isConnected() {
    return redisClient.isOpen;
  }

  getClient() {
    return redisClient;
  }

  async get(key) {
    if (!this.isConnected()) return null;

    return await redisClient.get(key);
  }

  async set(key, value, ttl = null) {
    if (!this.isConnected()) return false;

    if (ttl) {
      await redisClient.set(key, value, {
        EX: ttl,
      });
    } else {
      await redisClient.set(key, value);
    }

    return true;
  }

  async del(key) {
    if (!this.isConnected()) return false;

    await redisClient.del(key);

    return true;
  }

  async flush() {
    if (!this.isConnected()) return false;

    await redisClient.flushAll();

    return true;
  }
  
  async getCache(key) {
  if (!this.isConnected()) return null;

  const data = await redisClient.get(key);

  if (!data) {
    return null;
  }

  return JSON.parse(data);
}

async setCache(key, value, ttl = 300) {
  if (!this.isConnected()) return false;

  await redisClient.setEx(
    key,
    ttl,
    JSON.stringify(value)
  );

  console.log('Cache set for key:', key);
  return true;
}

async deleteCache(key) {
  if (!this.isConnected()) return false;

  await redisClient.del(key);

  return true;
}

async deleteByPattern(pattern) {
  if (!this.isConnected()) return false;

  const keys = await redisClient.keys(pattern);

  if (keys.length > 0) {
    await redisClient.del(keys);
  }

  return true;
}
}

export default new RedisService();