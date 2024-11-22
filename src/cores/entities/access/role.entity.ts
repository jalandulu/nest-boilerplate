import { Prisma } from '@prisma/client';
import { PermissionEntity } from './permission.entity';

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

export type RoleEntity = {
  id: number;
  name: string;
  slug: string;
  visible: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  permissions?: PermissionEntity[];
};
