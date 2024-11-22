import { Injectable } from '@nestjs/common';
import { BullRootModuleOptions, SharedBullConfigurationFactory } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { ICacheServiceEnv } from 'src/cores/interfaces';

@Injectable()
export class BullConfigService implements SharedBullConfigurationFactory {
  constructor(private readonly configService: ConfigService) {}
  createSharedConfiguration(): BullRootModuleOptions | Promise<BullRootModuleOptions> {
    const redis = this.configService.get<ICacheServiceEnv>('redis');

    return {
      redis: redis,
      prefix: 'bull-queue',
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: false,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    };
  }
}
