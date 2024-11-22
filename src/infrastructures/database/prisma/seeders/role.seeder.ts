import { PrismaClient } from '@prisma/client';
import { roles } from './data/role.data';
import { permissions } from './data/permission.data';

export default async function roleSeeder({ prisma }: { prisma: PrismaClient }) {
  for (const role of roles) {
    const permissionsFiltered = permissions
      .filter((p) => p.use.includes(role.slug as any))
      .map((p) => p.slug);

    const permissionIds = await prisma.permission.findMany({
      where: {
        slug: {
          in: permissionsFiltered,
        },
      },
      select: { id: true },
    });

    try {
      const exist = await prisma.role.findFirstOrThrow({
        where: {
          slug: role.slug,
        },
      });

      if (exist) {
        await prisma.permissionsOnRoles.deleteMany({
          where: {
            roleId: exist.id,
          },
        });

        await prisma.role.update({
          where: {
            id: exist.id,
          },
          data: {
            permissionsOnRoles: {
              create: permissionIds.map(({ id }) => ({
                permission: {
                  connect: {
                    id,
                  },
                },
              })),
            },
          },
        });
      }
    } catch (_error) {
      await prisma.role.create({
        data: {
          ...role,
          permissionsOnRoles: {
            create: permissionIds.map(({ id }) => ({
              permission: {
                connect: {
                  id,
                },
              },
            })),
          },
        },
      });
    }
  }
}
