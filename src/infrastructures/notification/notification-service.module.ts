import { Global, Module } from '@nestjs/common';
import { MqttModule } from './mqtt';

@Global()
@Module({
  imports: [MqttModule],
  exports: [MqttModule],
})
export class NotificationServiceModule {}
