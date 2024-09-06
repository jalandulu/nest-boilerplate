import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateRoleRequest,
  QueryRoleRequest,
  UpdateRoleRequest,
} from '../../requests';
import { RoleService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { RoleResourceMap } from '../../mappers';

@Injectable()
export class FindRoleUseCase {
  constructor(private readonly roleService: RoleService) {}

  async findOne(id: number) {
    const role = await this.roleService.findOne<RoleResourceMap>(id, {
      permissionsOnRoles: {
        include: {
          permission: true,
        },
      },
    });

    if (!role) {
      throw new NotFoundException();
    }

    return role;
  }
}
