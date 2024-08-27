import { Global, Module } from '@nestjs/common';
import { NodemailerModule } from './nodemailer/nodemailer.module';

@Global()
@Module({
  imports: [NodemailerModule],
  exports: [NodemailerModule],
})
export class MailerServiceModule {}
