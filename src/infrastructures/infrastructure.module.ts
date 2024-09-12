import { Module } from '@nestjs/common';
import { ConfigServiceModule } from './config';
import { DataServiceModule } from './database';
import { CacheServiceModule } from './cache';
import { QueueServiceModule } from './queue';
import { StorageServiceModule } from './storage';
import { JwtServiceModule } from './jwt';
import { RepositoryModule } from './repositories';
import { SignedUrlModule } from './signed-url';

@Module({
  imports: [
    ConfigServiceModule,
    DataServiceModule,
    CacheServiceModule,
    QueueServiceModule,
    StorageServiceModule,
    JwtServiceModule,
    SignedUrlModule,
    RepositoryModule,
  ],
  exports: [
    ConfigServiceModule,
    DataServiceModule,
    CacheServiceModule,
    QueueServiceModule,
    StorageServiceModule,
    JwtServiceModule,
    SignedUrlModule,
    RepositoryModule,
  ],
})
export class InfrastructureModule {}
