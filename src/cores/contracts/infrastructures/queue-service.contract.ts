import { Queue } from 'bullmq';

export abstract class IQueueServiceProvider {
  // abstract notification: Queue;
  abstract mailer: Queue;
}
