import { PrismaClient } from '@prisma/client';
import { directories } from './data/directory.data';

export default async function directorySeeder({ prisma }: { prisma: PrismaClient }) {
  for (const directory of directories) {
    try {
      await prisma.stgDirectory.findFirstOrThrow({
        where: {
          path: directory.path,
        },
      });
    } catch (_error) {
      await prisma.stgDirectory.create({
        data: directory,
      });
    }
  }
}
