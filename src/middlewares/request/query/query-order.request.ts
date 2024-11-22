import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { QueryOrder } from 'src/cores/consts';

export class QueryOrderRequest {
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
  @IsEnum(QueryOrder)
  @Transform(({ value }) => (value ? value : QueryOrder.asc))
  public mode: string;
}
