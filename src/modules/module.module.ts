import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AccessModule } from './access';
import { StorageModule } from './storage';
import { NotificationModule } from './notification';
import { EmailModule } from './email';

@Module({
  imports: [
    AuthModule,
    AccessModule,
    StorageModule,
    NotificationModule,
    EmailModule,
  ],
})
export class ModulesModule {}
