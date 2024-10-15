import { ICreateIdentityDto } from 'src/cores/interfaces/dtos';

export class SetIdentityRoleDto implements Pick<ICreateIdentityDto, 'roleId'> {
  roleId: number;

  constructor(payload: Pick<ICreateIdentityDto, 'roleId'>) {
    this.roleId = payload.roleId;
  }
}
