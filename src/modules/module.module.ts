import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AccessModule } from './access';
import { StorageModule } from './storage';
import { NotificationModule } from './notification';
import { EmailModule } from './email';
import { UserModule } from './user';

@Module({
  imports: [AuthModule, UserModule, AccessModule, StorageModule, NotificationModule, EmailModule],
})
export class ModulesModule {}
