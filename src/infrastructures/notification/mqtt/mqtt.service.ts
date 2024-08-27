import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BatchResponse,
  SendResponse,
  TokenMessage,
} from 'firebase-admin/lib/messaging/messaging-api';
import { IPublishPacket, ISubscriptionMap, MqttClient, connect } from 'mqtt';
import { INotificationServiceProvider } from 'src/cores/contracts';
import { IMqttServiceEnv } from 'src/cores/interfaces';

@Injectable()
export class MqttService
  implements INotificationServiceProvider, OnModuleInit, OnModuleDestroy
{
  private mqtt: MqttClient;

  constructor(private readonly configService: ConfigService) {}

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

  send({ token, ...message }: TokenMessage): Promise<string> {
    this.mqtt.publish(token, JSON.stringify(message));
    return Promise.resolve(JSON.stringify(message));
  }

  sendEach(messages: TokenMessage[]): Promise<BatchResponse> {
    const responses: SendResponse[] = [];

    for (const { token, ...message } of messages) {
      this.mqtt.publish(token, JSON.stringify(message));
      responses.push({
        success: true,
      });
    }

    return Promise.resolve({
      responses: responses,
      successCount: messages.length,
      failureCount: 0,
    });
  }

  publish(topic: string, message: any) {
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
