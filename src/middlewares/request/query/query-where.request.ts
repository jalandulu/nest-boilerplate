import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { QueryArgMode, QueryOperator } from 'src/cores/consts';
import { IQueryWhereRequest } from 'src/cores/interfaces';

export class QueryWhereRequest implements IQueryWhereRequest {
  @ApiProperty({
    type: String,
    description: 'Column of model',
  })
  @IsNotEmpty()
  @IsString()
  public column: string;

  @ApiProperty({
    type: String,
    description: 'Query filter operator',
  })
  @IsOptional()
  @IsString()
  @IsIn(QueryOperator)
  @Transform(({ value }) => (value ? value : 'equals'))
  public operator: string;

  @ApiProperty({
    type: String,
    description: 'Query filter mode',
  })
  @IsOptional()
  @IsString()
  @IsEnum(QueryArgMode)
  @Transform(({ value }) => (value ? value : QueryArgMode.default))
  public mode: 'default' | 'insensitive';

  @ApiProperty({
    type: String,
    description: 'Query filter value',
  })
  @IsOptional()
  public value: null | string | string[];
}
