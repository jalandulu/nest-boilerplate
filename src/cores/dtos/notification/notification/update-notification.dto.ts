import { ICreateNotificationDto } from './create-notification.dto';

export interface IUpdateNotificationDto<T> {
  service?: ICreateNotificationDto<T>['service'];
  type?: ICreateNotificationDto<T>['type'];
  notifiableType?: ICreateNotificationDto<T>['notifiableType'];
  notifiableId?: ICreateNotificationDto<T>['notifiableId'];
  data?: ICreateNotificationDto<T>['data'];
  sentAt?: ICreateNotificationDto<T>['sentAt'];
  readAt?: ICreateNotificationDto<T>['readAt'];
}
