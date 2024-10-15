import { INotifiableNotificationDto } from 'src/cores/interfaces/dtos';

export class NotifiableNotificationDto implements INotifiableNotificationDto {
  notifiableType?: string;
  notifiableId?: string;

  constructor(payload: INotifiableNotificationDto) {
    this.notifiableType = payload.notifiableType;
    this.notifiableId = payload.notifiableId;
  }
}
