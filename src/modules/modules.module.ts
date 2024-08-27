import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { Validators } from 'src/middlewares/validators';
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
  providers: [...Validators],
})
export class ModulesModule {}
