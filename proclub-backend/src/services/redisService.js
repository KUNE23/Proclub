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
}

export default new RedisService();