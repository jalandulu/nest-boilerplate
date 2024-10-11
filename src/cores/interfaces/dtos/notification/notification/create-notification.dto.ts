export interface ICreateNotificationDto<T> {
  service: string;
  type: string;
  notifiableType: string;
  notifiableId: string;
  data: T;
  sentAt?: string;
  readAt?: string;
}
