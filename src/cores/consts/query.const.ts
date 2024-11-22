import { IQueryableColumnType } from '../interfaces';

export const QueryDelimiter = {
  dot: '.',
  dash: '-',
  colon: ':',
  semicolon: ';',
} as const;

export const QueryMode = {
  or: 'OR',
  and: 'AND',
  not: 'NOT',
};

export const QueryArgMode = {
  default: 'default',
  insensitive: 'insensitive',
};

export const QueryOrder = {
  asc: 'asc',
  desc: 'desc',
};

export const QueryStringOperator = [
  'equals',
  'in',
  'notIn',
  'contains',
  'startsWith',
  'endsWith',
  'not',
];
export const QueryUuidOperator = ['equals', 'not', 'in', 'notIn'];
export const QueryBooleanOperator = QueryUuidOperator;
export const QueryNumericOperator = ['equals', 'in', 'notIn', 'lt', 'lte', 'gt', 'gte', 'not'];
export const QueryDatetimeOperator = ['lt', 'lte', 'gt', 'gte'];
export const QueryOperator = [
  'equals',
  'in',
  'notIn',
  'lt',
  'lte',
  'gt',
  'gte',
  'contains',
  'startsWith',
  'endsWith',
  'not',
];

export const OperatorValueCast = {
  in: 'array',
  notIn: 'array',
};

export const QueryOperatorMap: Map<IQueryableColumnType, string[]> = new Map([
  ['uuid', QueryUuidOperator],
  ['int', QueryNumericOperator],
  ['number', QueryNumericOperator],
  ['boolean', QueryBooleanOperator],
  ['datetime', QueryDatetimeOperator],
  ['string', QueryStringOperator],
]);
