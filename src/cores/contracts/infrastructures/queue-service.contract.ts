import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Queue } from 'bullmq';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';

export abstract class IQueueServiceProvider {
  abstract notification: Queue<Message>;
  abstract mailer: Queue<ISendMailOptions>;
}
