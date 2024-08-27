import { Global, HttpStatus, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';
import { ExtendedPrismaClient } from './prisma.extension';
import { CustomPrismaModule } from './custom-prisma.module';
import { EXTENDED_PRISMA_CLIENT } from './prisma.const';

@Global()
@Module({
  imports: [
    CustomPrismaModule,
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
      plugins: [
        new ClsPluginTransactional({
          imports: [CustomPrismaModule],
          adapter: new TransactionalAdapterPrisma<ExtendedPrismaClient>({
            prismaInjectionToken: EXTENDED_PRISMA_CLIENT,
          }),
          enableTransactionProxy: true,
        }),
      ],
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      inject: [HttpAdapterHost],
      useFactory: ({ httpAdapter }: HttpAdapterHost) => {
        return new PrismaClientExceptionFilter(httpAdapter, {
          P2000: HttpStatus.BAD_REQUEST,
          P2002: HttpStatus.CONFLICT,
          P2025: HttpStatus.NOT_FOUND,
        });
      },
    },
  ],
})
export class PrismaModule {}
