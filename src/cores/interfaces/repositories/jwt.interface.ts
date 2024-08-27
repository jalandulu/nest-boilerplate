import { IJwtSignDto } from 'src/cores/dtos';
import { JwtEntity } from 'src/cores/entities';

export abstract class IJwtRepository {
  abstract generate({ data }?: { data: IJwtSignDto }): Promise<string>;
  abstract verify({ token }?: { token: string }): Promise<JwtEntity>;
}
