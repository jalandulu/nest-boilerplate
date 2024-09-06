import { Injectable } from '@nestjs/common';
import { UpdateRoleRequest } from '../../requests';
import { RoleService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { RoleResourceMap } from '../../mappers';

@Injectable()
export class UpdateRoleUseCase {
  constructor(private readonly roleService: RoleService) {}

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
}
