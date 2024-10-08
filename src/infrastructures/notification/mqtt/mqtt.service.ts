import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  BatchResponse,
  SendResponse,
} from 'firebase-admin/lib/messaging/messaging-api';
import { DateTime } from 'luxon';
import { IPublishPacket, ISubscriptionMap } from 'mqtt';
import { INotificationServiceProvider } from 'src/cores/contracts';
import { ITokenMessage } from 'src/cores/interfaces';
import { ExtendedPrismaClient } from 'src/infrastructures/database';
import { MqttService as NestMqttService } from './mqtt';
import { NotificationMapper } from 'src/middlewares/interceptors';

@Injectable()
export class MqttService implements INotificationServiceProvider {
  constructor(
    private readonly notificationMapper: NotificationMapper,
    private readonly mqttService: NestMqttService,
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async send({ token, type, ...message }: ITokenMessage): Promise<string> {
    try {
      const notificationToken =
        await this.dataService.tx.notificationToken.findFirstOrThrow({
          where: { token },
          include: {
            user: true,
          },
        });

      const created = await this.dataService.tx.notification.create({
        data: {
          service: 'mqtt',
          type: type,
          notifiableType: 'users',
          notifiableId: notificationToken.user.id,
          data: message,
          sentAt: DateTime.now().toISO(),
        },
      });

      const mapped = this.notificationMapper.toResource(created);
      await this.mqttService.publish(token, JSON.stringify(mapped));

      return Promise.resolve(JSON.stringify(message));
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw error;
        }
      }

      throw new Error(error);
    }
  }

  async sendEach(messages: ITokenMessage[]): Promise<BatchResponse> {
    let failureCount = 0;
    const responses: SendResponse[] = [];
    const sents: Promise<string>[] = [];

    for (const message of messages) {
      sents.push(this.send(message));
    }

    const processes = await Promise.allSettled(sents);
    for (const proceed of processes) {
      if (proceed.status === 'fulfilled') {
        responses.push({
          success: true,
        });
      } else {
        failureCount += 1;
        responses.push({
          success: false,
          error: proceed.reason,
        });
      }
    }

    return Promise.resolve({
      responses: responses,
      successCount: messages.length - failureCount,
      failureCount: failureCount,
    });
  }

  async publish<T>(topic: string, message: T) {
    await this.mqttService.publish(topic, JSON.stringify(message));
  }

  async subscribe(topicObject: string | string[] | ISubscriptionMap) {
    await this.mqttService.subscribe(topicObject);
  }

  listen<T>(
    topic: string,
    callback: (payload: T, packet: IPublishPacket) => void,
  ) {
    this.mqttService.listen<T>(topic, callback);
  }
}
