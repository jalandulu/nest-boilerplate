import {
  CacheOptions,
  CacheOptionsFactory,
  CacheStore,
} from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { ICacheServiceEnv } from 'src/cores/interfaces';

@Injectable()
export class RedisConfigService implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  async createCacheOptions() {
    const config = await this.configService.get<ICacheServiceEnv>('redis');

    const store = await redisStore({
      socket: {
        host: config.host,
        port: config.port,
      },
      password: config.password,
      ttl: config.ttl,
    });

    return {
      isGlobal: true,
      store: store as unknown as CacheStore,
    } as CacheOptions;
  }
}
