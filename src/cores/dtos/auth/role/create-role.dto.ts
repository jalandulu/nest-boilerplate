import { Prisma } from '@prisma/client';
import _ from 'lodash';
import { ICreateRoleDto } from 'src/cores/interfaces/dtos';

export class CreateRoleDto implements ICreateRoleDto {
  name: string;
  permissions: number[];

  constructor(payload: ICreateRoleDto) {
    Object.assign(this, payload);
  }

  get slug() {
    if (!this.name) return undefined;
    return _.kebabCase(this.name);
  }

  get permissionsToPrisma(): Prisma.PermissionsOnRolesCreateWithoutRoleInput[] {
    return this.permissions.map((id) => ({
      permission: {
        connect: {
          id,
        },
      },
    }));
  }
}
