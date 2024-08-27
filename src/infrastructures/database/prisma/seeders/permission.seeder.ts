import { Prisma, PrismaClient } from '@prisma/client';
import { permissions } from './data/permission.data';

export default async function permissionSeeder({
  prisma,
}: {
  prisma: PrismaClient;
}) {
  const newPermissions: Prisma.PermissionUncheckedCreateInput[] = [];

  for (const permission of permissions) {
    try {
      await prisma.permission.findFirstOrThrow({
        where: {
          slug: permission.slug,
        },
      });
    } catch (error) {
      newPermissions.push({
        module: permission.module,
        action: permission.action,
        slug: permission.slug,
      });
    }
  }

  await prisma.permission.createMany({
    data: newPermissions,
  });
}
