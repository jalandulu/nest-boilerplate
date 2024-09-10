import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IORedisService } from './ioredis.service';
import { IORedisConfigService } from './ioredis.config';
import { ICacheServiceProvider } from 'src/cores/contracts';
import { REDIS_CLIENT } from './ioredis.module-definition';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (redisConfigService: IORedisConfigService) => {
        return await redisConfigService.createIORedisClient();
      },
      inject: [IORedisConfigService],
    },
    {
      provide: ICacheServiceProvider,
      useClass: IORedisService,
    },
    ConfigService,
    IORedisConfigService,
  ],
  exports: [REDIS_CLIENT, ICacheServiceProvider],
})
export class IORedisModule {}
