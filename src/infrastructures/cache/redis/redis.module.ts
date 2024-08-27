import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from './redis.service';
import { RedisConfigService } from './redis.config';
import { ICacheServiceProvider } from 'src/cores/contracts';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: RedisConfigService,
    }),
  ],
  providers: [
    {
      provide: ICacheServiceProvider,
      useClass: RedisService,
    },
  ],
  exports: [ICacheServiceProvider],
})
export class RedisModule {}
