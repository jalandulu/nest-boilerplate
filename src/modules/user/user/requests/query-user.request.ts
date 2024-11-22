import { QueryableUser } from 'src/cores/dtos';
import { QueryRequest } from 'src/middlewares/request/query/query.request';

export class QueryUserRequest extends QueryRequest<'User'> {
  constructor() {
    super('User', QueryableUser);
  }
}
