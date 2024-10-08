import { Injectable } from '@nestjs/common';
import {
  IPaginationMetaEntity,
  NotificationEntity,
  NotificationMap,
  NotificationResourceMap,
  NotificationsMap,
  NotificationStatisticMap,
} from 'src/cores/entities';

@Injectable()
export class NotificationMapper {
  constructor() {}

  toResource(notification: NotificationResourceMap): {
    data: NotificationEntity;
  } {
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

  toStatistic(data: NotificationStatisticMap) {
    return {
      data: {
        count: {
          all: data._count.id,
          unread: data._count.id - data._count.readAt,
          read: data._count.readAt,
        },
      },
    };
  }
}
