import { Prisma } from '@prisma/client';

export type ModelKeys<T extends Prisma.ModelName> = keyof Prisma.TypeMap['model'][T]['fields'];

export type WhereInput<T extends Prisma.ModelName> =
  Prisma.TypeMap['model'][T]['operations']['findMany']['args']['where'];

export type OrderBy<T extends Prisma.ModelName> =
  Prisma.TypeMap['model'][T]['operations']['findMany']['args']['orderBy'];
