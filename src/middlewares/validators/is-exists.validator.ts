import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { ExtendedPrismaClient } from 'src/infrastructures/database';

@ValidatorConstraint({ name: 'IsExists', async: true })
@Injectable()
export class IsExistsValidator implements ValidatorConstraintInterface {
  private readonly logger: Logger = new Logger(IsExistsValidator.name);

  constructor(
    private readonly database: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async validate(value: string, args?: ValidationArguments) {
    const params = args.constraints;
    const table: string = params[0];
    const column: string = params[1];

    try {
      const exist = await this.database.tx[table].isExists({
        [column]: value,
      });

      if (!exist) {
        this.logger.verbose(
          `${args.property} ${args.value} is doesn't exists.`,
        );

        return false;
      } else {
        return true;
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  defaultMessage() {
    return `$property is doesn't exists.`;
  }
}

export const IsExists = (
  table: Prisma.ModelName,
  column: string,
  validationOptions?: ValidationOptions,
) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [table, column],
      validator: IsExistsValidator,
    });
  };
};
