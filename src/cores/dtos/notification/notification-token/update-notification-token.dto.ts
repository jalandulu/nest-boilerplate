import { ICreateNotificationTokenDto } from './create-notification-token.dto';

export interface IUpdateNotificationTokenDto {
  userId?: ICreateNotificationTokenDto['userId'];
  type?: ICreateNotificationTokenDto['type'];
  token?: ICreateNotificationTokenDto['token'];
}
