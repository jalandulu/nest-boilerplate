import { Global, Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';

@Global()
@Module({
  imports: [RedisModule],
  exports: [RedisModule],
})
export class CacheServiceModule {}
