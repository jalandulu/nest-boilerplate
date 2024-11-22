import { Global, Module } from '@nestjs/common';
import { MqttModule, MqttService } from './mqtt';
import { INotificationServiceProvider } from 'src/cores/contracts';

@Global()
@Module({
  imports: [MqttModule],
  providers: [{ provide: INotificationServiceProvider, useClass: MqttService }],
  exports: [MqttModule, { provide: INotificationServiceProvider, useClass: MqttService }],
})
export class NotificationServiceModule {}
