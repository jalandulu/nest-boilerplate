import { Global, Module } from '@nestjs/common';
import { NodemailerModule } from './nodemailer/nodemailer.module';
import { IMailerServiceProvider } from 'src/cores/contracts';
import { NodemailerService } from './nodemailer';

@Global()
@Module({
  imports: [NodemailerModule],
  providers: [{ provide: IMailerServiceProvider, useClass: NodemailerService }],
  exports: [NodemailerModule, { provide: IMailerServiceProvider, useClass: NodemailerService }],
})
export class MailerServiceModule {}
