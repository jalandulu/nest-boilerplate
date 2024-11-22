import { Prisma } from '@prisma/client';
import { QueryBuildPrismaDto, QueryPrismaDto } from 'src/cores/contracts/dtos';
import {
  IPaginationDto,
  IQueryable,
  IQueryableMode,
  IQueryOrderRequest,
  IQueryRequest,
  IQueryWhereRequest,
} from 'src/cores/interfaces';
import { PaginationDto } from './pagination.dto';
import { OrderBy, WhereInput } from '../globals';
import { QueryMode } from '../consts';

export class QueryableDto<ModelName extends Prisma.ModelName>
  extends PaginationDto
  implements QueryBuildPrismaDto<ModelName>, QueryPrismaDto<ModelName>
{
  public model: string;
  public queryable: IQueryable<ModelName>[];
  public mode: IQueryableMode;
  public q?: string;
  public where?: IQueryWhereRequest[];
  public order?: IQueryOrderRequest[];

  constructor(query: IQueryRequest<ModelName> & IPaginationDto) {
    super(query);

    Object.assign(this, query);
  }

  get buildWhere(): WhereInput<ModelName> | undefined {
    if (this.q && !this.where) {
      this.where = this.queryable
        .filter((q) => q.accessables.includes('search'))
        .map((q) => {
          return {
            column: q.key[Object.keys(q.key)[0]] as string,
            operator: 'contains',
            mode: 'insensitive',
            value: this.q,
          };
        });
    }

    const filter = this.where?.reduce((acc, field) => {
      const queryable = this.queryable.find((q) => q.key[field.column]);

      let value: any = field.value;
      if (Array.isArray(value)) {
        value = value.map((v) => {
          if (['int', 'number'].includes(queryable.type)) {
            return parseInt(v);
          }
          return v;
        });
      } else {
        if (['int', 'number'].includes(queryable.type)) {
          value = parseInt(value);
        }
      }

      acc.push({
        [queryable.key[field.column]]: {
          [field.operator]: value,
        },
      });

      return acc;
    }, []);

    if (filter) {
      return {
        [this.mode]: filter,
      };
    }

    return undefined;
  }

  get toWhere() {
    return this.buildWhere;
  }

  get buildOrder(): OrderBy<ModelName> | undefined {
    if (!this.order) return undefined;

    const order = this.order?.reduce<Array<Record<string, keyof typeof QueryMode>>>(
      (acc, field) => {
        const queryable = this.queryable.find((q) => q.key[field.column]);
        if (!queryable) return acc;

        acc.push({
          [queryable.key[field.column]]: field.mode as any,
        });

        return acc;
      },
      [],
    );

    return order;
  }

  get toOrder() {
    return this.buildOrder;
  }

  merge(...query: WhereInput<ModelName>[]): WhereInput<ModelName> {
    if (!this.buildWhere || !this.buildWhere[this.mode]) {
      return {
        [this.mode]: query,
      };
    }

    return {
      [this.mode]: [
        ...(Array.isArray(this.buildWhere[this.mode])
          ? this.buildWhere[this.mode]
          : [this.buildWhere[this.mode]]),
        ...query,
      ],
    };
  }
}
