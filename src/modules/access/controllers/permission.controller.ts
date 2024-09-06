import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionMapper } from '../mappers';
import { Permissions } from 'src/common/decorators';
import { AccessAuthGuard, PermissionGuard } from 'src/middlewares/guards';
import { GetPermissionUseCase } from '../use-cases';

@ApiTags('Permissions')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'access/permissions',
  version: '1.0',
})
export class PermissionController {
  constructor(
    private readonly getUseCase: GetPermissionUseCase,
    private readonly mapper: PermissionMapper,
  ) {}

  @Get()
  @Permissions(['access:permission'])
  async findAll() {
    return this.mapper.toGroup(await this.getUseCase.findAll());
  }
}
