import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  BatchResponse,
  SendResponse,
} from 'firebase-admin/lib/messaging/messaging-api';
import { DateTime } from 'luxon';
import { IPublishPacket, ISubscriptionMap, MqttClient, connect } from 'mqtt';
import { INotificationServiceProvider } from 'src/cores/contracts';
import { IMqttServiceEnv, ITokenMessage } from 'src/cores/interfaces';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class MqttService
  implements INotificationServiceProvider, OnModuleInit, OnModuleDestroy
{
  private mqtt: MqttClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  onModuleInit() {
    const config = this.configService.get<IMqttServiceEnv>('mqtt');
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
    const connectionUrl = `mqtt://${config.host}:${config.port}`;

    this.mqtt = connect(connectionUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      username: config.user,
      password: config.password,
      reconnectPeriod: 1000,
    });

    this.mqtt.on('connect', function () {
      console.log('MQTT Broker connected to ' + connectionUrl);
    });

    this.mqtt.on('error', function () {
      console.log('MQTT Broker error in connecting to ' + connectionUrl);
    });
  }

  onModuleDestroy() {
    this.mqtt.end();
  }

  async send({ token, type, ...message }: ITokenMessage): Promise<string> {
    try {
      const notificationToken =
        await this.dataService.tx.notificationToken.findFirstOrThrow({
          where: { token },
          include: {
            user: true,
          },
        });

      await Promise.all([
        this.mqtt.publishAsync(token, JSON.stringify(message)),
        this.dataService.tx.notification.create({
          data: {
            service: 'mqtt',
            type: type,
            notifiableType: 'users',
            notifiableId: notificationToken.user.id,
            data: message,
            sentAt: DateTime.now().toISO(),
          },
        }),
      ]);
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

  publish<T>(topic: string, message: T) {
    this.mqtt.publish(topic, JSON.stringify(message));
  }

  subscribe(topicObject: string | string[] | ISubscriptionMap) {
    this.mqtt.subscribe(topicObject);
  }

  listen<T>(
    topic: string,
    callback: (payload: T, packet: IPublishPacket) => void,
  ) {
    this.mqtt.on('message', (_topic, _payload, _packet) => {
      if (topic === _topic) {
        callback(JSON.parse(_payload.toString('utf8')) as T, _packet);
      }
    });
  }
}
