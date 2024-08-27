import { Prisma, PrismaClient } from '@prisma/client';
import { DateTime } from 'luxon';
import { pagination } from 'prisma-extension-pagination';

export const extendedPrismaClient = new PrismaClient<
  Prisma.PrismaClientOptions,
  'query' | 'info' | 'warn' | 'error'
>({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
})
  .$extends({
    model: {
      $allModels: {
        async isExists<T>(
          this: T,
          where: Prisma.Args<T, 'findFirst'>['where'],
        ): Promise<boolean> {
          // Get the current model at runtime
          const context = Prisma.getExtensionContext(this);

          const result = await (context as any).findFirst({
            where: {
              ...where,
            },
          });

          return result !== null;
        },
        async isUnique<T>(
          this: T,
          where: Prisma.Args<T, 'findFirst'>['where'],
          exclude?: Prisma.Args<T, 'findFirst'>['where'],
        ): Promise<boolean> {
          const context = Prisma.getExtensionContext(this) as T;

          if (!where || typeof where !== 'object') {
            throw new Error('Invalid where condition');
          }

          const whereCondition: Prisma.Args<T, 'findFirst'>['where'] = {
            ...where,
            deletedAt: null,
          };

          if (exclude) {
            Object.keys(exclude).forEach((key) => {
              whereCondition[key] = {
                ...whereCondition[key],
                not: exclude[key],
              };
            });
          }

          const result = await (context as any).findFirst({
            where: whereCondition,
          });

          return result === null;
        },
        async softDelete<T>(this: T, where: Prisma.Args<T, 'update'>['where']) {
          const context = Prisma.getExtensionContext(this);

          return await (context as any).update({
            where,
            data: {
              deletedAt: DateTime.now().toISO(),
            },
          });
        },
        async softDeleteMany<T>(
          this: T,
          where: Prisma.Args<T, 'updateMany'>['where'],
        ) {
          const context = Prisma.getExtensionContext(this);

          return await (context as any).updateMany({
            where,
            data: {
              deletedAt: DateTime.now().toISO(),
            },
          });
        },
      },
    },
  })
  .$extends(
    pagination({
      pages: {
        limit: 15,
        includePageCount: true,
      },
      cursor: {
        limit: 15,
      },
    }),
  );

export type ExtendedPrismaClient = typeof extendedPrismaClient;
