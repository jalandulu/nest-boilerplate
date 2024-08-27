import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IPaginationMetaEntity } from 'src/cores/entities';
import { PermissionMapper } from './permission.mapper';

export type RoleMap = Prisma.RoleGetPayload<Prisma.RoleDefaultArgs>;

export type RoleResourceMap = Prisma.RoleGetPayload<{
  include: {
    permissionsOnRoles: {
      include: {
        permission: true;
      };
    };
  };
}>;

export type RolesMap = RoleMap[];

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
        permissions: permissions,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      },
    };
  }

  toMap(role: RoleMap) {
    return {
      data: {
        id: role.id,
        name: role.name,
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
