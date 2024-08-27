import { BullModule as BullQueueModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BullConfigService } from './bull.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullQueueService } from './bull.service';
import {
  IMailerServiceProvider,
  IQueueServiceProvider,
} from 'src/cores/contracts';
import { SendEmailProcessor } from './processors';
import {
  MailerServiceModule,
  NodemailerService,
} from 'src/infrastructures/mailer';

@Module({
  imports: [
    BullQueueModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: BullConfigService,
    }),
    BullQueueModule.registerQueueAsync({
      imports: [MailerServiceModule],
      inject: [IMailerServiceProvider],
      name: 'mailer',
    }),
  ],
  providers: [
    {
      provide: IQueueServiceProvider,
      useClass: BullQueueService,
    },
    { provide: IMailerServiceProvider, useClass: NodemailerService },
    SendEmailProcessor,
    // SendNotificationJob,
  ],
  exports: [IQueueServiceProvider],
})
export class BullModule {}
