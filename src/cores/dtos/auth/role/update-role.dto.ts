import { IUpdateRoleDto } from 'src/cores/interfaces/dtos';

export class UpdateRoleDto implements IUpdateRoleDto {
  name?: string;
  permissions?: number[];
}
