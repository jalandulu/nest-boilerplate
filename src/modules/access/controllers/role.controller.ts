import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateRoleRequest, QueryRoleRequest, UpdateRoleRequest } from '../requests';
import { ApiTags } from '@nestjs/swagger';
import { AccessAuthGuard, PermissionGuard } from 'src/middlewares/guards';
import { Permissions } from 'src/common/decorators';
import { RoleUseCase } from '../use-cases';
import { RoleMapper } from 'src/middlewares/interceptors';

@ApiTags('Roles')
@UseGuards(AccessAuthGuard, PermissionGuard)
@Controller({
  path: 'access/roles',
  version: '1.0',
})
export class RoleController {
  constructor(
    private readonly mapper: RoleMapper,
    private readonly useCase: RoleUseCase,
  ) {}

  @Get()
  @Permissions(['access:view'])
  async findAll(@Query() query: QueryRoleRequest) {
    return this.mapper.toCollection(await this.useCase.findAll(query));
  }

  @Get(':id')
  @Permissions(['access:view'])
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const role = await this.useCase.findOne(id);

    return this.mapper.toResource(role);
  }

  @Post()
  @Permissions(['access:create'])
  async create(@Body() createRoleRequest: CreateRoleRequest) {
    const created = await this.useCase.create(createRoleRequest);

    return this.mapper.toResource(created);
  }

  @Patch(':id')
  @Permissions(['access:update'])
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleRequest: UpdateRoleRequest,
  ) {
    const updated = await this.useCase.update(id, updateRoleRequest);

    return this.mapper.toResource(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions(['access:delete'])
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.useCase.remove(id);
  }
}
