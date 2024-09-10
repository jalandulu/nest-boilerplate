import { Global, Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ICacheServiceProvider } from 'src/cores/contracts';
import { REDIS_CLIENT } from './ioredis.module-definition';

@Global()
@Injectable()
export class IORedisService implements ICacheServiceProvider {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async set<T>(key: string, value: T, ttl?: number) {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async get<T>(key: string) {
    const r = await this.redis.get(key);
    return JSON.parse(r) as T;
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
