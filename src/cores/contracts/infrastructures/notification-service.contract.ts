import { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api';
import { ITokenMessage } from 'src/cores/interfaces';

export abstract class INotificationServiceProvider {
  abstract send(options: ITokenMessage, dryRun?: boolean): Promise<string>;

  abstract sendEach(options: ITokenMessage[], dryRun?: boolean): Promise<BatchResponse>;
}
