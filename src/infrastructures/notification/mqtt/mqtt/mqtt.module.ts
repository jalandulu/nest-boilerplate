import { DynamicModule, Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
} from './mqtt.module-definition';

@Module({
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    return {
      module: MqttModule,
      providers: [
        {
          provide: MODULE_OPTIONS_TOKEN,
          useValue: options,
        },
        MqttService,
      ],
      exports: [MqttService],
      ...super.forRoot(options),
    };
  }

  static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return {
      module: MqttModule,
      providers: [
        {
          provide: MODULE_OPTIONS_TOKEN,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        MqttService,
      ],
      exports: [MqttService],
      ...super.forRootAsync(options),
    };
  }
}
