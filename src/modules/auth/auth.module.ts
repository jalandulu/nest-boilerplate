import { Module } from '@nestjs/common';
import { AuthController } from './controllers';
import {
  IdentityService,
  JwtService,
  RoleService,
  UserService,
  DirectoryService,
  FileDirectoryService,
  FileService,
} from 'src/services';
import { AuthService } from 'src/services';
import { JwtStrategy, LocalStrategy } from 'src/middlewares/strategies';
import { IJwtRepository, IStorageRepository } from 'src/cores/interfaces';
import {
  JwtRepository,
  StorageRepository,
} from 'src/infrastructures/repositories';
import { LoginUseCase, RegisterUseCase, LogoutUseCase } from './use-cases';
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
    LocalStrategy,
    JwtStrategy,
    JwtService,
    AuthService,
    RoleService,
    UserService,
    IdentityService,
    DirectoryService,
    FileService,
    FileDirectoryService,
    { provide: IJwtRepository, useClass: JwtRepository },
    { provide: IStorageRepository, useClass: StorageRepository },
  ],
})
export class AuthModule {}
