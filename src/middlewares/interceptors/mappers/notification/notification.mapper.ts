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
  toResource(notification: NotificationResourceMap): NotificationEntity {
    return {
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
    };
  }

  toMap(notification: NotificationMap): NotificationEntity {
    return this.toResource(notification);
  }

  toCollection(notifications: NotificationsMap): NotificationEntity[] {
    return notifications.map((i) => this.toMap(i));
  }

  toPaginate(data: NotificationsMap, meta: IPaginationMetaEntity) {
    return {
      data: this.toCollection(data),
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
