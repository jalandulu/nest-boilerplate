import { ICreateIdentityDto } from './create-identity.dto';

export interface IUpdateIdentityPasswordDto {
  currentPassword: ICreateIdentityDto['password'];
  password: ICreateIdentityDto['password'];
}
