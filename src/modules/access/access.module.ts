import { Module } from '@nestjs/common';
import { PermissionController } from './controllers';
import { RoleController } from './controllers/role.controller';
import { PermissionUseCase, RoleUseCase } from './use-cases';

@Module({
  controllers: [RoleController, PermissionController],
  providers: [RoleUseCase, PermissionUseCase],
})
export class AccessModule {}
