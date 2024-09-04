import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import { QueueNotificationProcessor } from 'src/cores/consts';
import { INotificationServiceProvider } from 'src/cores/contracts';

@Processor('notification')
export class SendNotificationProcessor {
  private readonly logger = new Logger(SendNotificationProcessor.name);

  constructor(private readonly notification: INotificationServiceProvider) {}

  @Process(QueueNotificationProcessor.SendNotification)
  handle({ data }: Job<Message>) {
    this.logger.verbose(
      `Notification Send: ${QueueNotificationProcessor.SendNotification}`,
    );
    this.logger.verbose(`Notification Data: ${data}`);

    this.notification.send(data);
  }
}
