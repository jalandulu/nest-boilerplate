import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateRoleRequest,
  QueryRoleRequest,
  UpdateRoleRequest,
} from '../requests';
import { RoleService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { RoleResourceMap } from '../mappers';

@Injectable()
export class RoleUseCase {
  constructor(private readonly roleService: RoleService) {}

  async findAll(query: QueryRoleRequest) {
    return await this.roleService.findAll(query);
  }

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

  @Transactional()
  async create(createRoleRequest: CreateRoleRequest) {
    return await this.roleService.create<RoleResourceMap>(createRoleRequest, {
      permissionsOnRoles: {
        include: {
          permission: true,
        },
      },
    });
  }

  @Transactional()
  async update(id: number, updateRoleRequest: UpdateRoleRequest) {
    return await this.roleService.update<RoleResourceMap>(
      id,
      updateRoleRequest,
      {
        permissionsOnRoles: {
          include: {
            permission: true,
          },
        },
      },
    );
  }

  @Transactional()
  async remove(id: number) {
    return await this.roleService.remove(id);
  }
}
