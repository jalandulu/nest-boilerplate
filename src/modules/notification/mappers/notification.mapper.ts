import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IPaginationMetaEntity } from 'src/cores/entities';

export type NotificationMap =
  Prisma.NotificationGetPayload<Prisma.NotificationDefaultArgs>;

export type NotificationResourceMap = NotificationMap;

export type NotificationsMap = NotificationMap[];

@Injectable()
export class NotificationMapper {
  constructor() {}

  toResource(notification: NotificationResourceMap) {
    return {
      data: {
        id: notification.id,
        service: notification.service,
        type: notification.type,
        notifiableType: notification.notifiableType,
        notifiableId: notification.notifiableId,
        data: notification.data,
        sentAt: notification.sentAt,
        readAt: notification.readAt,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      },
    };
  }

  toMap(notification: NotificationMap) {
    return {
      data: this.toResource(notification).data,
    };
  }

  toCollection(notifications: NotificationsMap) {
    return {
      data: notifications.map((notification) => {
        return this.toMap(notification).data;
      }),
    };
  }

  toPaginate(data: NotificationMap[], meta: IPaginationMetaEntity) {
    return {
      data: data.map((notification) => {
        return this.toMap(notification).data;
      }),
      meta,
    };
  }
}
