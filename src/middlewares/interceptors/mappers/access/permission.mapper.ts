import { Injectable } from '@nestjs/common';
import {
  PermissionEntity,
  PermissionGroupMap,
  PermissionMap,
  PermissionsMap,
} from 'src/cores/entities';

@Injectable()
export class PermissionMapper {
  toMap(permission: PermissionMap): { data: PermissionEntity } {
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
