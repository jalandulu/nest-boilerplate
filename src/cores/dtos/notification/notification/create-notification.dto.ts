import { ICreateNotificationDto } from 'src/cores/interfaces/dtos';

export class CreateNotificationDto<T extends { [key: string]: any }>
  implements ICreateNotificationDto<T>
{
  service: string;
  type: string;
  notifiableType: string;
  notifiableId: string;
  data: T;
  sentAt?: string;
  readAt?: string;
}
