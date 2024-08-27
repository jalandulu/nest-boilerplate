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
import {
  CreateRoleRequest,
  QueryRoleRequest,
  UpdateRoleRequest,
} from '../requests';
import { ApiTags } from '@nestjs/swagger';
import { RoleMapper } from '../mappers/role.mapper';
import { RoleUseCase } from '../use-cases';
import { JwtAuthGuard, PermissionGuard } from 'src/middlewares/guards';
import { Permissions } from 'src/common/decorators';

@ApiTags('Roles')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller({
  path: 'access/roles',
  version: '1.0',
})
export class RoleController {
  constructor(
    private readonly roleMapper: RoleMapper,
    private readonly roleUseCase: RoleUseCase,
  ) {}

  @Get()
  @Permissions(['access:view'])
  async findAll(@Query() query: QueryRoleRequest) {
    return this.roleMapper.toCollection(await this.roleUseCase.findAll(query));
  }

  @Get(':id')
  @Permissions(['access:view'])
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const role = await this.roleUseCase.findOne(id);

    return this.roleMapper.toResource(role);
  }

  @Post()
  @Permissions(['access:create'])
  async create(@Body() createRoleRequest: CreateRoleRequest) {
    const created = await this.roleUseCase.create(createRoleRequest);

    return this.roleMapper.toResource(created);
  }

  @Patch(':id')
  @Permissions(['access:update'])
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleRequest: UpdateRoleRequest,
  ) {
    const updated = await this.roleUseCase.update(id, updateRoleRequest);

    return this.roleMapper.toResource(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions(['access:delete'])
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.roleUseCase.remove(id);
  }
}
