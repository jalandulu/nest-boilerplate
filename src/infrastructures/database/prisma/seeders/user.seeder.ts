import { Prisma, PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

export default async function userSeeder({ prisma }: { prisma: PrismaClient }) {
  const role = await prisma.role.findFirst({
    where: {
      slug: 'superadmin',
    },
    include: {
      permissionsOnRoles: true,
    },
  });

  const user: Prisma.UserUncheckedCreateInput = {
    type: 'UTP001',
    name: 'Superadmin Nest',
    email: 'superadmin@nest.com',
    identity: {
      create: {
        roleId: role.id,
        username: 'superadmin@nest.com',
        password: await hash('password', 10),
        status: 'AST001',
        permissionsOnIdentities: {
          create: role.permissionsOnRoles.map((permission) => {
            return { permissionId: permission.permissionId };
          }),
        },
      },
    },
  };

  try {
    const exist = await prisma.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (exist) {
      await prisma.permissionsOnIdentities.deleteMany();
      await prisma.user.update({
        where: {
          id: exist.id,
        },
        data: {
          type: 'UTP001',
          name: 'Superadmin Nest',
          email: 'superadmin@nest.com',
          identity: {
            update: {
              roleId: role.id,
              username: 'superadmin@nest.com',
              password: await hash('password', 10),
              status: 'AST001',
              permissionsOnIdentities: {
                create: role.permissionsOnRoles.map((permission) => {
                  return { permissionId: permission.permissionId };
                }),
              },
            },
          },
        },
      });
    } else {
      await prisma.user.create({
        data: user,
      });
    }
  } catch (error) {
    console.error(error);
  }
}
