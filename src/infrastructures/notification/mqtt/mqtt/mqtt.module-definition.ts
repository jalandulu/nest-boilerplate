import { ConfigurableModuleBuilder } from '@nestjs/common';
import { MqttModuleOptions } from './mqtt.interface';

export const MQTT = Symbol('MQTT');

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<MqttModuleOptions>()
  .setExtras(
    {
      isGlobal: true,
    },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }),
  )
  .setFactoryMethodName('createMqttModuleOptions')
  .setClassMethodName('forRoot')
  .build();
