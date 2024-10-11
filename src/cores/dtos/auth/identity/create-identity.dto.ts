import { ICreateIdentityDto } from 'src/cores/interfaces/dtos';

export class CreateIdentityDto implements ICreateIdentityDto {
  userId: string;
  roleId: number;
  username: string;
  password: string;
  permissionIds?: number[];
}
