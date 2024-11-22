import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from './mqtt.module-definition';
import { ITokenMessage, MqttModuleOptions } from './mqtt.interface';
import { connect, IPublishPacket, ISubscriptionMap, MqttClient } from 'mqtt';
import { BatchResponse, SendResponse } from 'firebase-admin/lib/messaging/messaging-api';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private mqtt: MqttClient;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) private readonly options: MqttModuleOptions) {}

  async onModuleInit() {
    const { brokerUrl, options } = this.options;
    this.mqtt = connect(brokerUrl, options);

    this.mqtt.on('connect', function () {
      console.log('MQTT Broker connected to ' + brokerUrl);
    });

    this.mqtt.on('error', function () {
      console.log('MQTT Broker error in connecting to ' + brokerUrl);
    });
  }

  onModuleDestroy() {
    this.mqtt.end();
  }

  async send({ token, ...message }: ITokenMessage): Promise<string> {
    await this.mqtt.publishAsync(token, JSON.stringify(message));
    return Promise.resolve(JSON.stringify(message));
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
    return await this.mqtt.publishAsync(topic, JSON.stringify(message));
  }

  async subscribe(topicObject: string | string[] | ISubscriptionMap) {
    return await this.mqtt.subscribeAsync(topicObject);
  }

  listen<T>(topic: string, callback: (payload: T, packet: IPublishPacket) => void) {
    this.mqtt.on('message', (_topic, _payload, _packet) => {
      if (topic === _topic) {
        callback(JSON.parse(_payload.toString('utf8')) as T, _packet);
      }
    });
  }
}
