import { Global, Module } from '@nestjs/common';
import { IORedisModule, IORedisService } from './ioredis';
import { RedisModule } from './redis';
import { ICacheServiceProvider } from 'src/cores/contracts';

@Global()
@Module({
  imports: [RedisModule, IORedisModule],
  providers: [
    {
      provide: ICacheServiceProvider,
      useClass: IORedisService,
    },
  ],
  exports: [
    RedisModule,
    IORedisModule,
    {
      provide: ICacheServiceProvider,
      useClass: IORedisService,
    },
  ],
})
export class CacheServiceModule {}
