import { Module } from '@nestjs/common';
import {
  NotificationController,
  NotificationTokenController,
} from './controllers';
import {
  GetNotifiationUseCase,
  ReadNotifiationUseCase,
  ReadManyNotifiationUseCase,
  RemoveNotifiationUseCase,
  RemoveManyNotifiationUseCase,
  UpsertNotifiationTokenUseCase,
  GenerateNotifiationTokenUseCase,
} from './use-cases';

@Module({
  controllers: [NotificationTokenController, NotificationController],
  providers: [
    GetNotifiationUseCase,
    ReadNotifiationUseCase,
    ReadManyNotifiationUseCase,
    RemoveNotifiationUseCase,
    RemoveManyNotifiationUseCase,
    UpsertNotifiationTokenUseCase,
    GenerateNotifiationTokenUseCase,
  ],
})
export class NotificationModule {}
