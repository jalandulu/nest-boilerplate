import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

export type PermissionMap =
  Prisma.PermissionGetPayload<Prisma.PermissionDefaultArgs>;

export type PermissionsMap = PermissionMap[];

export type PermissionGroupMap = {
  module: string;
  permissions: {
    id: number;
    slug: string;
    action: string;
  }[];
}[];

@Injectable()
export class PermissionMapper {
  toMap(permission: PermissionMap) {
    return {
      data: {
        id: permission.id,
        module: permission.module,
        action: permission.action,
        slug: permission.slug,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
      },
    };
  }

  toCollection(permissions: PermissionsMap) {
    return {
      data: permissions.map((status) => {
        return this.toMap(status).data;
      }),
    };
  }

  toGroup(permissions: PermissionGroupMap) {
    return {
      data: permissions,
    };
  }
}
