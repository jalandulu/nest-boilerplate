import { Module } from '@nestjs/common';
import { AuthController } from './controllers';
import {
  LoginUseCase,
  RegisterUseCase,
  LogoutUseCase,
  RefreshUseCase,
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
  ],
})
export class AuthModule {}
