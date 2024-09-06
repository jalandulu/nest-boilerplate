import { NotificationType } from 'src/cores/enums';

export interface ICreateNotificationTokenDto {
  userId: string;
  type: NotificationType;
  token: string;
}
