import { Module } from '@nestjs/common';
import { AuthController } from './controllers';
import {
  LoginUseCase,
  RegisterUseCase,
  LogoutUseCase,
  RefreshUseCase,
  EmailVerificationUseCase,
  ResetPasswordUseCase,
} from './use-cases';
import { AuthMapper } from './mappers/auth.mapper';
import { FileMapper } from '../storage/mappers';

@Module({
  controllers: [AuthController],
  providers: [
    AuthMapper,
    FileMapper,
    RegisterUseCase,
    LoginUseCase,
    LogoutUseCase,
    RefreshUseCase,
    EmailVerificationUseCase,
    ResetPasswordUseCase,
  ],
})
export class AuthModule {}
