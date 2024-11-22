import { Module } from '@nestjs/common';
import {
  NotificationController,
  NotificationSelfController,
  NotificationTokenController,
} from './controllers';
import {
  NotificationTokenUseCase,
  NotificationUseCase,
  StatisticNotificationUseCase,
} from './use-cases';

@Module({
  controllers: [NotificationTokenController, NotificationSelfController, NotificationController],
  providers: [StatisticNotificationUseCase, NotificationUseCase, NotificationTokenUseCase],
})
export class NotificationModule {}
