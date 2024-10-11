import { INotifiableNotificationDto } from 'src/cores/interfaces/dtos';

export class NotifiableNotificationDto implements INotifiableNotificationDto {
  notifiableType?: string;
  notifiableId?: string;
}
