import { InjectTransactionHost, TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUUID } from 'class-validator';
import { ModelKeys } from 'src/cores/globals';
import { ExtendedPrismaClient } from 'src/infrastructures/database';

@Injectable()
export class ExistedIdValidationPipe<
  Model extends Prisma.ModelName,
  Column extends ModelKeys<Model>,
> implements PipeTransform
{
  tableName: Model;
  columnName: Column;

  constructor(
    readonly database: TransactionHost<TransactionalAdapterPrisma<ExtendedPrismaClient>>,
  ) {}

  static option<Model extends Prisma.ModelName, Column extends ModelKeys<Model>>(
    tableName: Model,
    columnName: Column,
  ) {
    class ValidationPipe extends ExistedIdValidationPipe<Model, Column> {
      constructor(
        @InjectTransactionHost()
        database: TransactionHost<TransactionalAdapterPrisma<ExtendedPrismaClient>>,
      ) {
        super(database);
        this.tableName = tableName;
        this.columnName = columnName;
      }
    }

    return ValidationPipe;
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    if (!this.columnName || !this.tableName) {
      throw new InternalServerErrorException('table or column not assigned yet');
    }

    this.validateFieldType(value);

    const exist = await this.database.tx[this.tableName as Prisma.ModelName].isExists({
      [this.columnName]: value,
    });

    if (!exist) {
      throw new BadRequestException(`Validation failed (${metadata.data} does not exist)`);
    }

    return value;
  }

  validateFieldType(value: any) {
    const fieldType = Prisma.dmmf.datamodel.models
      .find((model) => model.name === this.tableName)
      ?.fields.find((field) => field.name === this.columnName)?.type;

    const columnName = String(this.columnName);

    switch (fieldType?.toLowerCase()) {
      case 'int':
        if (typeof value === 'string') {
          const numValue = Number(value);
          if (isNaN(numValue)) {
            throw new BadRequestException(`field ${columnName} must be a valid number`);
          }
        }
        return true;
      case 'string':
        if (typeof value !== 'string') {
          throw new BadRequestException(`field ${columnName} must be a string`);
        }
        return true;
      case 'uuid':
        if (typeof value !== 'string' || !isUUID(value)) {
          throw new BadRequestException(`field ${columnName} must be a valid uuid`);
        }
        return true;
      default:
        throw new BadRequestException(`invalid value provided`);
    }
  }
}
