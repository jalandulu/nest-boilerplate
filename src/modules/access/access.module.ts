import { Module } from '@nestjs/common';
import { PermissionController } from './controllers';
import {
  AuthService,
  JwtService,
  PermissionService,
  RoleService,
} from 'src/services';
import { PermissionMapper, RoleMapper } from './mappers';
import { PermissionUseCase, RoleUseCase } from './use-cases';
import { JwtStrategy } from 'src/middlewares/strategies';
import { IJwtRepository } from 'src/cores/interfaces';
import { JwtRepository } from 'src/infrastructures/repositories';
import { RoleController } from './controllers/role.controller';

@Module({
  controllers: [RoleController, PermissionController],
  providers: [
    RoleMapper,
    PermissionMapper,
    RoleService,
    PermissionMapper,
    PermissionService,
    RoleUseCase,
    PermissionUseCase,
    JwtStrategy,
    JwtService,
    AuthService,
    { provide: IJwtRepository, useClass: JwtRepository },
  ],
})
export class AccessModule {}
