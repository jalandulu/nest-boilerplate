import { IJwtSignDto } from 'src/cores/dtos';
import { JwtEntity } from 'src/cores/entities';
import { TokenScope } from 'src/cores/enums';

export abstract class IJwtRepository {
  abstract generate({ data }?: { data: IJwtSignDto }): Promise<{
    iat: number;
    exp: number;
    token: string;
  }>;
  abstract verify({ token }?: { token: string }): Promise<JwtEntity>;
  abstract getExpiration({ scope }: { scope: TokenScope }): number;
}
