import { Injectable } from '@nestjs/common';
import {
  PrismaOptionsFactory,
  PrismaServiceOptions,
  loggingMiddleware,
} from 'nestjs-prisma';

@Injectable()
export class PrismaConfigService implements PrismaOptionsFactory {
  createPrismaOptions(): PrismaServiceOptions | Promise<PrismaServiceOptions> {
    return {
      prismaOptions: {
        log: ['info', 'query', 'warn', 'error'],
        transactionOptions: {
          timeout: 30000,
          maxWait: 30000,
        },
      },
      middlewares: [loggingMiddleware()],
      explicitConnect: true,
    };
  }
}
