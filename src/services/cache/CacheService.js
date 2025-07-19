const redis = require('redis');
const { AppConfig } = require('../../shareds/AppConfig');

class CacheService {
  constructor() {
    this._cache = redis.createClient({
      socket: {
        host: AppConfig.redis.Host,
      },
    });

    this._cache.on('error', (error) => {
      console.error('Unexpected error happened on Cache Service', error);
    });

    this._cache.connect();
  }

  async set(key, value, options = {
    expirationInSeconds: 1800,
  }) {
    await this._cache.set(key, value, {
      expiration: {
        type: 'EX',
        value: options.expirationInSeconds,
      },
    });
  }

  async get(key) {
    const result = await this._cache.get(key);
    if (result === null) {
      throw new Error(`Cache ${key} not found`);
    }

    return result;
  }

  async delete(key) {
    await this._cache.del(key);
  }

  async getOrCreate(key, factory, options = {
    expirationInSeconds: 1800,
  }) {
    let result;
    let fromCache = false;
    try {
      result = await this.get(key);
      fromCache = true;
    } catch (error) {
      result = await factory();
      await this.set(key, result, options);
    }

    return { result, fromCache };
  }
}

module.exports = { CacheService };
