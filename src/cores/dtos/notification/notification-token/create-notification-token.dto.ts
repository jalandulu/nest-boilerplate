import { NotificationTokenType } from 'src/cores/enums';

export interface ICreateNotificationTokenDto {
  userId: string;
  type: NotificationTokenType;
  token: string;
}
