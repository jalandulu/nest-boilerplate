import { Prisma } from '@prisma/client';
import { OrderBy, WhereInput } from 'src/cores/globals';

export abstract class PrismaDto {
  abstract get toPrisma();
}

export abstract class QueryPrismaDto<Model extends Prisma.ModelName> {
  abstract get toWhere(): WhereInput<Model> | undefined;
  abstract get toOrder(): OrderBy<Model> | undefined;
}

export abstract class QueryBuildPrismaDto<Model extends Prisma.ModelName> {
  abstract get buildWhere(): WhereInput<Model> | undefined;
  abstract get buildOrder(): OrderBy<Model> | undefined;
}
