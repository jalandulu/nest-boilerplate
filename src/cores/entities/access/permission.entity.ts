import { Prisma } from '@prisma/client';

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

export type PermissionEntity = {
  id: number;
  module: string;
  action: string;
  slug: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};
