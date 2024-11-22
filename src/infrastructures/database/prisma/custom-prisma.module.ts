import { Module } from '@nestjs/common';
import { extendedPrismaClient } from './prisma.extension';
import { EXTENDED_PRISMA_CLIENT } from './prisma.const';

@Module({
  providers: [{ provide: EXTENDED_PRISMA_CLIENT, useValue: extendedPrismaClient }],
  exports: [EXTENDED_PRISMA_CLIENT],
})
export class CustomPrismaModule {}
