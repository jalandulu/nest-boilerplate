import { Injectable } from '@nestjs/common';
import { IPaginationMetaEntity } from 'src/cores/entities';
import { PermissionMapper } from './permission.mapper';
import {
  RoleEntity,
  RoleMap,
  RoleResourceMap,
  RolesMap,
} from 'src/cores/entities/access/role.entity';

@Injectable()
export class RoleMapper {
  constructor(private readonly permissionMapper: PermissionMapper) {}

  toResource(role: RoleResourceMap) {
    const permissions = this.permissionMapper.toCollection(
      role.permissionsOnRoles.map(({ permission }) => permission),
    ).data;

    return {
      data: {
        id: role.id,
        name: role.name,
        slug: role.slug,
        visible: role.visible,
        permissions: permissions,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      },
    };
  }

  toMap(role: RoleMap): { data: RoleEntity } {
    return {
      data: {
        id: role.id,
        name: role.name,
        slug: role.slug,
        visible: role.visible,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      },
    };
  }

  toCollection(roles: RolesMap) {
    return {
      data: roles.map((status) => {
        return this.toMap(status).data;
      }),
    };
  }

  toPaginate(data: RoleMap[], meta: IPaginationMetaEntity) {
    return {
      data: data.map((role) => {
        return this.toMap(role).data;
      }),
      meta,
    };
  }
}
