import { Injectable } from '@nestjs/common';
import {
  PermissionEntity,
  PermissionGroupMap,
  PermissionMap,
  PermissionsMap,
} from 'src/cores/entities';

@Injectable()
export class PermissionMapper {
  toMap(permission: PermissionMap): PermissionEntity {
    return {
      id: permission.id,
      module: permission.module,
      action: permission.action,
      slug: permission.slug,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }

  toCollection(permissions: PermissionsMap): PermissionEntity[] {
    return permissions.map((i) => this.toMap(i));
  }

  toGroup(permissions: PermissionGroupMap) {
    return {
      data: permissions,
    };
  }
}
