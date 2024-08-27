import { Prisma, PrismaClient } from '@prisma/client';
import { codes } from './data/code.data';

export default async function codeSeeder({ prisma }: { prisma: PrismaClient }) {
  const newCodes: Prisma.CodeUncheckedCreateInput[] = [];

  for (const code of codes) {
    try {
      await prisma.code.findFirstOrThrow({
        where: {
          code: code.code,
        },
      });
    } catch (error) {
      newCodes.push({
        type: code.type,
        name: code.name,
        code: code.code,
      });
    }
  }

  await prisma.code.createMany({
    data: newCodes,
  });
}
