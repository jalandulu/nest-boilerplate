import { NotificationTokenType } from 'src/cores/enums';
import { ICreateNotificationTokenDto } from 'src/cores/interfaces/dtos';

export class CreateNotificationTokenDto implements ICreateNotificationTokenDto {
  userId: string;
  type: NotificationTokenType;
  token: string;
}
