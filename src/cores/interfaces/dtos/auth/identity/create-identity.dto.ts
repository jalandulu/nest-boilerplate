export interface ICreateIdentityDto {
  userId: string;
  roleId: number;
  username: string;
  password: string;
  permissionIds?: number[];
}
