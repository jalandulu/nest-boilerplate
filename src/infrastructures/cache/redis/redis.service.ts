import { Global, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ICacheServiceProvider } from 'src/cores/contracts';

@Global()
@Injectable()
export class RedisService implements ICacheServiceProvider {
  constructor(@Inject(CACHE_MANAGER) private readonly redis: Cache) {}

  async set<T>(key: string, value: T, ttl?: number) {
    await this.redis.set(key, value, ttl);
  }

  async get<T>(key: string) {
    return await this.redis.get<T>(key);
  }

  async del(key: string) {
    await this.redis.del(key);
  }

  async has(key: string): Promise<boolean> {
    const exist = await this.redis.get(key);
    return exist !== null || exist !== undefined;
  }

  async reset() {
    await this.redis.reset();
  }
}
