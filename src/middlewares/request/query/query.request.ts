import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { QueryWhereRequest } from './query-where.request';
import { Query } from 'src/common/helpers';
import { QueryOrderRequest } from './query-order.request';
import { QueryMode } from 'src/cores/consts';
import { PaginationRequest } from '../pagination.request';
import { IsQueryableColumn } from 'src/middlewares/validators';
import { Prisma } from '@prisma/client';
import { IQueryable } from 'src/cores/interfaces';

export class QueryRequest<Model extends Prisma.ModelName> extends PaginationRequest {
  constructor(
    public model: Model,
    public queryable: IQueryable<Model>[],
  ) {
    super();
  }

  @ApiProperty({
    type: String,
    description: 'Query mode',
  })
  @IsOptional()
  @IsString()
  @IsEnum(QueryMode)
  public mode: string = 'AND';

  @ApiProperty({
    type: String,
    description: 'Query search',
  })
  @IsOptional()
  @IsString()
  public q?: string;

  @ApiProperty({
    type: [QueryWhereRequest],
    description: 'Column of model',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @IsArray()
  @IsQueryableColumn('column', { each: true, targetValue: 'value', targetOperator: 'operator' })
  @Transform(({ value, obj }: { value: string[]; obj: QueryRequest<Model> }) => {
    return value.map((v) => {
      const parsed = Query.parseWhere(Query.transformValue(v, obj.q));
      return plainToInstance(QueryWhereRequest, {
        ...parsed,
        value: parsed.value,
      });
    });
  })
  @Type(() => QueryWhereRequest)
  public where?: QueryWhereRequest[];

  @ApiProperty({
    type: [QueryOrderRequest],
    description: 'Column of model',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @IsArray()
  @IsQueryableColumn('column', { each: true })
  @Transform(({ value }: { value: string[] }) => {
    return value.map((v) => plainToInstance(QueryOrderRequest, Query.parseOrder(v)));
  })
  @Type(() => QueryOrderRequest)
  public order?: QueryOrderRequest[];
}
