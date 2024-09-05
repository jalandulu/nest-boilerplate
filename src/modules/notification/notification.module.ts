import { Module } from '@nestjs/common';
import { NotificationController } from './controllers';
import { JwtService } from 'src/services';
import { AuthService } from 'src/services';
import { AccessStrategy } from 'src/middlewares/strategies';
import { IJwtRepository } from 'src/cores/interfaces';
import { JwtRepository } from 'src/infrastructures/repositories';
import { INotificationServiceProvider } from 'src/cores/contracts';
import { MqttService } from 'src/infrastructures/notification/mqtt/mqtt.service';

@Module({
  controllers: [NotificationController],
  providers: [
    AccessStrategy,
    JwtService,
    AuthService,
    { provide: IJwtRepository, useClass: JwtRepository },
    { provide: INotificationServiceProvider, useClass: MqttService },
  ],
})
export class NotificationModule {}
