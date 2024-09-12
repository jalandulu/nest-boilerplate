import { Queue } from 'bullmq';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import { MailMessage } from 'src/cores/interfaces';

export abstract class IQueueServiceProvider {
  abstract notification: Queue<Message>;
  abstract mailer: Queue<MailMessage>;
}
