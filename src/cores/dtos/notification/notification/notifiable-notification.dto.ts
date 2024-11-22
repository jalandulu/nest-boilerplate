import { INotifiableNotificationDto } from 'src/cores/interfaces/dtos';

export class NotifiableNotificationDto implements INotifiableNotificationDto {
  notifiableType?: string;
  notifiableId?: string;

  constructor(payload: INotifiableNotificationDto) {
    Object.assign(this, payload);
  }
}
