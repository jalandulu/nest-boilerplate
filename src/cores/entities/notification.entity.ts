import { Prisma } from '@prisma/client';

export type NotificationMap =
  Prisma.NotificationGetPayload<Prisma.NotificationDefaultArgs>;

export type NotificationResourceMap = NotificationMap;

export type NotificationsMap = NotificationMap[];

export type NotificationEntity = {
  id: number;
  service: string;
  type: string;
  notifiableType: string;
  notifiableId: string;
  data: Prisma.JsonValue;
  sentAt: string | Date;
  readAt: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type NotificationTokenEntity = {
  type: string;
  token: string;
};
