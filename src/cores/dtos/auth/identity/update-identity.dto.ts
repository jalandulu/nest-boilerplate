export interface IUpdateIdentityDto {
  username?: string;
  password?: string;
}

export interface IUpdateIdentityCredentialDto {
  currentPassword: string;
  password: string;
}
