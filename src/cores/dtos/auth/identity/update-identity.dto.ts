import { IUpdateIdentityDto } from 'src/cores/interfaces/dtos';

export class UpdateIdentityDto implements IUpdateIdentityDto {
  roleId?: number;
  username?: string;
  password?: string;
  permissionIds?: number[];
}
