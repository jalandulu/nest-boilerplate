import { ICreateRoleDto } from 'src/cores/interfaces/dtos';

export class CreateRoleDto implements ICreateRoleDto {
  name: string;
  permissions: number[];
}
