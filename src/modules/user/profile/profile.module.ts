import { Module } from '@nestjs/common';
import { ProfileController } from './controllers';
import {
  ProfilePasswordUseCase,
  ProfilePictureUseCase,
  ProfileUseCase,
} from './use-cases';

@Module({
  controllers: [ProfileController],
  providers: [ProfileUseCase, ProfilePictureUseCase, ProfilePasswordUseCase],
})
export class ProfileModule {}
