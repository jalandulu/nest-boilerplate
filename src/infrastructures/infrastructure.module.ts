import { Module } from '@nestjs/common';
import { ConfigServiceModule } from './config';
import { DataServiceModule } from './database';
import { CacheServiceModule } from './cache';
import { QueueServiceModule } from './queue';
import { StorageServiceModule } from './storage';
import { JwtServiceModule } from './jwt';
import { RepositoryModule } from './repositories';

@Module({
  imports: [
    ConfigServiceModule,
    DataServiceModule,
    CacheServiceModule,
    QueueServiceModule,
    StorageServiceModule,
    JwtServiceModule,
    RepositoryModule,
  ],
  exports: [
    ConfigServiceModule,
    DataServiceModule,
    CacheServiceModule,
    QueueServiceModule,
    StorageServiceModule,
    JwtServiceModule,
    RepositoryModule,
  ],
})
export class InfrastructureModule {}
