import { BullModule as BullQueueModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BullConfigService } from './bull.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullQueueService } from './bull.service';
import {
  IMailerServiceProvider,
  INotificationServiceProvider,
  IQueueServiceProvider,
} from 'src/cores/contracts';
import { SendEmailProcessor, SendNotificationProcessor } from './processors';
import { MailerServiceModule, NodemailerService } from 'src/infrastructures/mailer';
import { NotificationServiceModule, MqttService } from 'src/infrastructures/notification';

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
    BullQueueModule.registerQueueAsync({
      imports: [NotificationServiceModule],
      inject: [INotificationServiceProvider],
      name: 'notification',
    }),
  ],
  providers: [
    SendEmailProcessor,
    SendNotificationProcessor,
    {
      provide: IQueueServiceProvider,
      useClass: BullQueueService,
    },
    {
      provide: IMailerServiceProvider,
      useClass: NodemailerService,
    },
    {
      provide: INotificationServiceProvider,
      useClass: MqttService,
    },
  ],
  exports: [BullQueueModule, IQueueServiceProvider],
})
export class BullModule {}
