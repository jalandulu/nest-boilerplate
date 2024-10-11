import {
  ICreateNotificationDto,
  IUpdateNotificationDto,
} from 'src/cores/interfaces/dtos';

export class UpdateNotificationDto<T extends { [key: string]: any }>
  implements IUpdateNotificationDto<T>
{
  service?: ICreateNotificationDto<T>['service'];
  type?: ICreateNotificationDto<T>['type'];
  notifiableType?: ICreateNotificationDto<T>['notifiableType'];
  notifiableId?: ICreateNotificationDto<T>['notifiableId'];
  data?: ICreateNotificationDto<T>['data'];
  sentAt?: ICreateNotificationDto<T>['sentAt'];
  readAt?: ICreateNotificationDto<T>['readAt'];
}
