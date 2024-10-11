import { TokenScope } from 'src/cores/enums';
import { IJwtSignDto } from 'src/cores/interfaces/dtos';

export class JwtSignDto implements IJwtSignDto {
  userId: string;
  username: string;
  scope: TokenScope;
  permissions?: string[];
}
