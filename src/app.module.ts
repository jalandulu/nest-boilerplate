import { Module } from '@nestjs/common';
import { ConfigServiceModule } from './infrastructures/config';
import { ModulesModule } from './modules';
import { CacheServiceModule } from './infrastructures/cache';
import { DataServiceModule } from './infrastructures/database';
import { QueueServiceModule } from './infrastructures/queue';
import { StorageServiceModule } from './infrastructures/storage';
import { JwtServiceModule } from './infrastructures/jwt';

@Module({
  imports: [
    ConfigServiceModule,
    DataServiceModule,
    CacheServiceModule,
    QueueServiceModule,
    StorageServiceModule,
    JwtServiceModule,
    ModulesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
