import { Module } from '@nestjs/common';
import { PermissionController } from './controllers';
import { PermissionMapper, RoleMapper } from './mappers';
import { RoleController } from './controllers/role.controller';
import {
  CreateRoleUseCase,
  FindRoleUseCase,
  GetPermissionUseCase,
  GetRoleUseCase,
  RemoveRoleUseCase,
  UpdateRoleUseCase,
} from './use-cases';

@Module({
  controllers: [RoleController, PermissionController],
  providers: [
    RoleMapper,
    PermissionMapper,
    GetRoleUseCase,
    FindRoleUseCase,
    CreateRoleUseCase,
    UpdateRoleUseCase,
    RemoveRoleUseCase,
    GetPermissionUseCase,
  ],
})
export class AccessModule {}
