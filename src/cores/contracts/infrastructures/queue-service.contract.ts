import { Queue } from 'bullmq';
import { ITokenMessage, MailMessage } from 'src/cores/interfaces';

export abstract class IQueueServiceProvider {
  abstract notification: Queue<ITokenMessage>;
  abstract mailer: Queue<MailMessage>;
}
