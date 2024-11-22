import { Generate } from 'src/common/helpers';
import { NotificationTokenType } from 'src/cores/enums';
import { ICreateNotificationTokenDto } from 'src/cores/interfaces/dtos';

export class CreateNotificationTokenDto implements ICreateNotificationTokenDto {
  userId: string;
  type: NotificationTokenType;
  token: string;

  constructor(
    payload: Omit<ICreateNotificationTokenDto, 'token'> & {
      token?: string;
    },
  ) {
    Object.assign(this, {
      ...payload,
      token: payload.token ? payload.token : Generate.notificationToken(),
    });
  }
}
