import { TokenMessage } from 'firebase-admin/lib/messaging/messaging-api';
import { IClientOptions } from 'mqtt/*';

export interface MqttModuleOptions {
  brokerUrl: string;
  options: IClientOptions;
}

export interface ITokenMessage extends TokenMessage {
  type: string;
}

export interface MqttModuleOptionsFactory {
  createMqttModuleOptions(): Promise<MqttModuleOptions> | MqttModuleOptions;
}
