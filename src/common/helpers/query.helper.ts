import { OperatorValueCast, QueryDelimiter } from 'src/cores/consts';
import { IQueryOrderRequest, IQueryWhereRequest } from 'src/cores/interfaces';

export namespace Query {
  export function parseWhere(
    where: string,
    options: {
      delimiterValue: keyof typeof QueryDelimiter;
      delimiterArgs: keyof typeof QueryDelimiter;
    } = { delimiterArgs: 'dot', delimiterValue: 'colon' },
  ): IQueryWhereRequest {
    const [args, value] = where.split(QueryDelimiter[options.delimiterValue]);
    const [column, operator, mode] = args.split(QueryDelimiter[options.delimiterArgs]);
    const castValue = OperatorValueCast[operator] || 'string';
    return {
      column,
      operator,
      mode: mode as any,
      value: value ? parseValue(value, castValue) : undefined,
    };
  }

  export function parseOrder(
    where: string,
    options: {
      delimiter: keyof typeof QueryDelimiter;
    } = { delimiter: 'dot' },
  ): IQueryOrderRequest {
    const [column, mode] = where.split(QueryDelimiter[options.delimiter]);

    return {
      column,
      mode,
    };
  }

  export function transformValue(
    value: string,
    nullablevalue: string,
    options: {
      delimiter: keyof typeof QueryDelimiter;
    } = { delimiter: 'colon' },
  ): string {
    const delimiter = QueryDelimiter[options.delimiter];
    if (!value.split(delimiter)[1]) {
      if (value.includes(delimiter)) {
        return (value += nullablevalue);
      }

      return (value += delimiter + nullablevalue);
    }

    return value;
  }

  export function parseValue(
    value: string,
    castTo: 'array' | 'string',
    options: {
      delimiter: keyof typeof QueryDelimiter;
    } = { delimiter: 'semicolon' },
  ): null | string | string[] {
    if (value === 'null') {
      return null;
    }

    if (castTo === 'array') {
      return value.split(QueryDelimiter[options.delimiter]);
    }

    return value;
  }
}
