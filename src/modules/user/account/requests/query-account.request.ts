import { QueryableIdentity } from 'src/cores/dtos';
import { QueryRequest } from 'src/middlewares/request/query/query.request';

export class QueryAccountRequest extends QueryRequest<'Identity'> {
  constructor() {
    super('Identity', QueryableIdentity);
  }
}
