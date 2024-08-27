import { TokenScope } from 'src/cores/enums';

export interface IJwtSignDto {
  userId: string;
  username: string;
  scope: TokenScope;
  permissions?: string[];
}
