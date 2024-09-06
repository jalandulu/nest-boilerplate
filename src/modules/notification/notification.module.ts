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
import { NotificationMapper } from './mappers';

@Module({
  controllers: [NotificationTokenController, NotificationController],
  providers: [
    NotificationMapper,
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
