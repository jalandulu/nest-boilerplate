import { DEFAULT_ROLE } from 'src/cores/consts';
import { QueryableDto } from 'src/cores/dtos/queryable.dto';
import { IQueryable, IQueryRequest } from 'src/cores/interfaces';

export const QueryableUser: IQueryable<'User'>[] = [
  { key: { type: 'type' }, type: 'string', accessables: ['single'] },
  { key: { name: 'name' }, type: 'string', accessables: ['single', 'search'] },
  { key: { email: 'email' }, type: 'string', accessables: ['single', 'search'] },
  { key: { emailVerifiedAt: 'emailVerifiedAt' }, type: 'datetime', accessables: ['single'] },
  { key: { createdAt: 'createdAt' }, type: 'datetime', accessables: ['single'] },
];

export class QueryUserDto extends QueryableDto<'User'> {
  constructor(
    public readonly currentUserId: string,
    query: IQueryRequest<'User'>,
  ) {
    super(query);
  }

  get toWhere() {
    return this.merge(
      {
        id: {
          not: this.currentUserId,
        },
      },
      {
        identity: {
          roleId: {
            not: DEFAULT_ROLE,
          },
        },
      },
    );
  }
}
