import { ICreateIdentityDto } from './create-identity.dto';

export type IUpdateIdentityDto = Partial<Omit<ICreateIdentityDto, 'id'>>;

export interface IUpdateIdentityCredentialDto {
  username?: string;
  password?: string;
}

export interface IUpdateIdentityPasswordDto {
  currentPassword: string;
  password: string;
}
