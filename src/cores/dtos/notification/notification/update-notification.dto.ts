import { IUpdateNotificationDto } from 'src/cores/interfaces/dtos';

export class UpdateNotificationDto<T extends { [key: string]: any }>
  implements IUpdateNotificationDto<T>
{
  service?: string;
  type?: string;
  notifiableType?: string;
  notifiableId?: string;
  data?: T;
  sentAt?: string;
  readAt?: string;

  constructor(payload: IUpdateNotificationDto<T>) {
    this.service = payload.service;
    this.type = payload.type;
    this.notifiableType = payload.notifiableType;
    this.notifiableId = payload.notifiableId;
    this.data = payload.data;
    this.readAt = payload.sentAt;
    this.sentAt = payload.readAt;
  }
}
