import { Prisma } from '@prisma/client';

export const roles: Prisma.RoleUncheckedCreateInput[] = [
  {
    name: 'Superadmin',
    slug: 'superadmin',
    visible: false,
  },
  {
    name: 'Admin',
    slug: 'admin',
    visible: true,
  },
];
