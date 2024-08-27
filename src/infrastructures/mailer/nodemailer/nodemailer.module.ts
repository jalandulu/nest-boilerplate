import { Global, Module } from '@nestjs/common';
import { MailerModule as NodeMailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NodemailerConfigService } from './nodemailer.config';
import { NodemailerService } from './nodemailer.service';
import { IMailerServiceProvider } from 'src/cores/contracts';

@Global()
@Module({
  imports: [
    NodeMailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: NodemailerConfigService,
    }),
  ],
  providers: [
    {
      provide: IMailerServiceProvider,
      useClass: NodemailerService,
    },
  ],
  exports: [IMailerServiceProvider],
})
export class NodemailerModule {}
