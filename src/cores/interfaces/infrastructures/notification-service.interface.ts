import { TokenMessage } from 'firebase-admin/lib/messaging/messaging-api';

export interface ITokenMessage extends TokenMessage {
  type: string;
}
