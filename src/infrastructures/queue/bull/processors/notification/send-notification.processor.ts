import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QueueNotificationProcessor } from 'src/cores/consts';
import { INotificationServiceProvider } from 'src/cores/contracts';
import { ITokenMessage } from 'src/cores/interfaces';

@Processor('notification')
export class SendNotificationProcessor {
  private readonly logger = new Logger(SendNotificationProcessor.name);

  constructor(private readonly notification: INotificationServiceProvider) {}

  @Process(QueueNotificationProcessor.SendNotification)
  handle({ data }: Job<ITokenMessage>) {
    this.logger.verbose(
      `Notification Send: ${QueueNotificationProcessor.SendNotification}`,
    );
    this.logger.verbose(`Notification Data: ${data}`);

    this.notification.send(data);
  }
}
