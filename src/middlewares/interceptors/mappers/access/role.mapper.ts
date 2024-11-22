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

  toResource(role: RoleResourceMap): RoleEntity {
    const permissions = role.permissionsOnRoles.map(({ permission }) => permission);

    return {
      id: role.id,
      name: role.name,
      slug: role.slug,
      visible: role.visible,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      permissions: this.permissionMapper.toCollection(permissions),
    };
  }

  toMap(role: RoleMap): RoleEntity {
    return {
      id: role.id,
      name: role.name,
      slug: role.slug,
      visible: role.visible,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  toCollection(roles: RolesMap): RoleEntity[] {
    return roles.map((i) => this.toMap(i));
  }

  toPaginate(data: RolesMap, meta: IPaginationMetaEntity) {
    return {
      data: this.toCollection(data),
      meta,
    };
  }
}
