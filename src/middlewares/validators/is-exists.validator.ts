import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { ValidationOptions } from 'src/cores/interfaces';
import { ExtendedPrismaClient } from 'src/infrastructures/database';

export type IsExistValidationOption = ValidationOptions & {
  invert?: boolean;
  exclude?: {
    targetColumn: string;
    targetValue: ['param' | 'body', string];
  };
};

@ValidatorConstraint({ name: 'IsExists', async: true })
@Injectable()
export class IsExistsValidator implements ValidatorConstraintInterface {
  private readonly logger: Logger = new Logger(IsExistsValidator.name);

  private options: Map<string, IsExistValidationOption> = new Map();

  constructor(
    private readonly database: TransactionHost<TransactionalAdapterPrisma<ExtendedPrismaClient>>,
  ) {}

  async validate(value: string, args: ValidationArguments) {
    const [table, column, options] = args.constraints;
    const request = args.object as any;

    if (!this.options?.get(args.property)) {
      this.options.set(args.property, options);
    }

    try {
      let query = {
        [column as string]: value,
      };

      if (options.exclude) {
        const [tProp, tValue] = options.exclude.targetValue;
        const target = tProp == 'param' ? request['_params'] : request;

        query = {
          [column as string]: value,
          [options.exclude.targetColumn]: {
            not: target[tValue],
          },
        };
      }

      const exist = await this.database.tx[table as string].isExists(query);

      if (!exist) {
        return options?.invert ? true : false;
      } else {
        return options?.invert ? false : true;
      }
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    if (this.options?.get(args.property)?.invert) {
      return `$property is already exists`;
    }

    return `$property doesn't exist`;
  }
}

export const IsExists = (
  table: Prisma.ModelName,
  column: string,
  validationOptions?: IsExistValidationOption,
) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [table, column, validationOptions],
      validator: IsExistsValidator,
    });
  };
};
