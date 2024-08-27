import {
  Message,
  BatchResponse,
} from 'firebase-admin/lib/messaging/messaging-api';

export abstract class INotificationServiceProvider {
  abstract send(options: Message, dryRun?: boolean): Promise<string>;

  abstract sendEach(
    options: Message[],
    dryRun?: boolean,
  ): Promise<BatchResponse>;
}
