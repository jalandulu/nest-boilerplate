import { InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  isBooleanString,
  isUUID,
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { QueryOperatorMap } from 'src/cores/consts';
import { IQueryable, IQueryableColumnType, ValidationOptions } from 'src/cores/interfaces';

export type IsQueryableColumnValidationOption = ValidationOptions & {
  targetValue?: string;
  targetOperator?: string;
};

@ValidatorConstraint({ name: 'IsQueryableColumn' })
export class IsQueryableColumnValidator implements ValidatorConstraintInterface {
  private validationType: 'column' | 'value' | 'operator' = 'column';

  validate(value: any, args: ValidationArguments) {
    const [property, validationOptions] = args.constraints;

    const model: Prisma.ModelName = args.object['model'];
    if (!model) {
      throw new InternalServerErrorException(
        'model is undefined, make sure to implement IQueryable interface',
      );
    }

    const columns: IQueryable<typeof model>[] = args.object['queryable'];
    const matched = columns.find((c) => {
      if (Array.isArray(value)) {
        return value.some((v) => v[property] === c.key[property]);
      }
      return Object.keys(c.key)[0] === value[property];
    });

    if (!matched) {
      return false;
    }

    if (validationOptions?.targetValue) {
      if (Array.isArray(value)) {
        for (const v of value) {
          const cValue = v[validationOptions?.targetValue];
          if (!this.validateType(matched.type, cValue)) {
            this.validationType = 'value';
            return false;
          }
        }
      }

      if (!this.validateType(matched.type, value[validationOptions?.targetValue])) {
        this.validationType = 'value';
        return false;
      }
    }

    if (validationOptions?.targetOperator) {
      if (Array.isArray(value)) {
        for (const v of value) {
          const cOperator = v[validationOptions?.targetOperator];
          if (!this.validateOperator(matched.type, cOperator)) {
            this.validationType = 'operator';
            return false;
          }
        }
      }

      if (!this.validateOperator(matched.type, value[validationOptions?.targetOperator])) {
        this.validationType = 'operator';
        return false;
      }
    }

    return true;
  }

  private validateType(key: IQueryableColumnType, value: any): boolean {
    switch (key) {
      case 'int':
      case 'number':
        if (Array.isArray(value)) {
          for (const v of value) {
            if (typeof v === 'string') {
              const numValue = Number(v);
              if (isNaN(numValue)) {
                return false;
              }
            }
          }
        }

        if (typeof value === 'string') {
          const numValue = Number(value);
          if (isNaN(numValue)) {
            return false;
          }
        }
        return true;
      case 'uuid':
        if (Array.isArray(value)) {
          for (const v of value) {
            if (typeof v !== 'string' || !isUUID(v)) {
              return false;
            }
          }
        }

        if (typeof value !== 'string' || !isUUID(value)) {
          return false;
        }
        return true;
      case 'datetime':
        if (Array.isArray(value)) {
          for (const v of value) {
            const date = new Date(v);
            return date instanceof Date && !isNaN(date.getTime());
          }
        }

        const date = new Date(value);
        return date instanceof Date && !isNaN(date.getTime());
      case 'boolean':
        if (Array.isArray(value)) {
          for (const v of value) {
            if (!isBooleanString(v)) {
              return false;
            }
          }
        }

        if (!isBooleanString(value)) {
          return false;
        }
        return true;
      case 'string':
        return true;
    }
  }

  private validateOperator(key: IQueryableColumnType, operator: string): boolean {
    const operators = QueryOperatorMap.get(key);
    if (!operators.find((o) => o === operator)) {
      return false;
    }

    return true;
  }

  defaultMessage({ object }: ValidationArguments) {
    if (this.validationType === 'column') {
      return `$property column must match with: [${object['queryable']
        .map((item) => Object.keys(item.key))
        .join(', ')}]`;
    }

    if (this.validationType === 'operator') {
      return `$property is invalid operator`;
    }

    return `$property column value type is invalid`;
  }
}

export function IsQueryableColumn(
  property: string,
  validationOptions?: IsQueryableColumnValidationOption,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property, validationOptions],
      validator: IsQueryableColumnValidator,
    });
  };
}
