import { ICreateIdentityDto } from './create-identity.dto';

export interface IUpdateIdentityCredentialDto {
  username?: ICreateIdentityDto['username'];
  password?: ICreateIdentityDto['password'];
}
