import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MqttModuleOptions, MqttModuleOptionsFactory } from './mqtt';
import { IMqttServiceEnv } from 'src/cores/interfaces';

@Injectable()
export class MqttConfigService implements MqttModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMqttModuleOptions(): MqttModuleOptions {
    const config = this.configService.get<IMqttServiceEnv>('mqtt');

    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
    const brokerUrl = `mqtt://${config.host}:${config.port}`;

    return {
      brokerUrl,
      options: {
        clientId,
        clean: true,
        connectTimeout: 4000,
        username: config.user,
        password: config.password,
        reconnectPeriod: 1000,
      },
    };
  }
}
