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

@ValidatorConstraint({ name: 'IsUnique', async: true })
@Injectable()
export class IsUniqueValidator implements ValidatorConstraintInterface {
  private readonly logger: Logger = new Logger(IsUniqueValidator.name);

  constructor(
    private readonly database: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async validate(value: string, args?: ValidationArguments) {
    const params = args.constraints;
    const table: string = params[0];
    const column: string = params[1];

    try {
      const unique = await this.database.tx[table].isUnique({
        [column]: value.toUpperCase(),
      });

      if (!unique) {
        this.logger.verbose(
          `${args.property} with ${args.value} must be unique.`,
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
    return `$property is already exists.`;
  }
}

export const IsUnique = (
  table: Uncapitalize<Prisma.ModelName>,
  column: string,
  validationOptions?: ValidationOptions,
) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [table, column],
      validator: IsUniqueValidator,
    });
  };
};
