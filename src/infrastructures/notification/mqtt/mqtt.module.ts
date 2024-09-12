import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { MqttModule as NestMqttModule } from './mqtt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MqttConfigService } from './mqtt.config';

@Module({
  imports: [
    NestMqttModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: MqttConfigService,
    }),
  ],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
