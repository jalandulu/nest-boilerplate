import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionMapper } from '../mappers';
import { PermissionUseCase } from '../use-cases';
import { Permissions } from 'src/common/decorators';
import { AccessAuthGuard, PermissionGuard } from 'src/middlewares/guards';

@ApiTags('Permissions')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'access/permissions',
  version: '1.0',
})
export class PermissionController {
  constructor(
    private readonly permissionUseCase: PermissionUseCase,
    private readonly permissionMapper: PermissionMapper,
  ) {}

  @Get()
  @Permissions(['access:permission'])
  async findAll() {
    return this.permissionMapper.toGroup(
      await this.permissionUseCase.findAll(),
    );
  }
}
