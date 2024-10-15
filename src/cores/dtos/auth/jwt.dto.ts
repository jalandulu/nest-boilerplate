import { TokenScope } from 'src/cores/enums';
import { IJwtSignDto } from 'src/cores/interfaces/dtos';

export class JwtSignDto implements IJwtSignDto {
  userId: string;
  username: string;
  scope: TokenScope;
  permissions?: string[];

  constructor(payload: IJwtSignDto) {
    this.userId = payload.userId;
    this.username = payload.username;
    this.scope = payload.scope;
    this.permissions = payload.permissions;
  }
}
