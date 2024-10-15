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

  constructor(payload: ICreateNotificationDto<T>) {
    this.service = payload.service;
    this.type = payload.type;
    this.notifiableType = payload.notifiableType;
    this.notifiableId = payload.notifiableId;
    this.data = payload.data;
    this.readAt = payload.sentAt;
    this.sentAt = payload.readAt;
  }
}
