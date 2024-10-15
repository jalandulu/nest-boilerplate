import { Prisma } from '@prisma/client';
import _ from 'lodash';
import { IUpdateRoleDto } from 'src/cores/interfaces/dtos';

export class UpdateRoleDto implements IUpdateRoleDto {
  name?: string;
  permissions?: number[];

  constructor(payload: IUpdateRoleDto) {
    this.name = payload.name;
    this.permissions = payload.permissions;
  }

  get slug() {
    if (!this.name) return undefined;
    return _.kebabCase(this.name);
  }

  get permissionsToPrisma():
    | Prisma.PermissionsOnRolesCreateWithoutRoleInput[]
    | undefined {
    if (!this.permissions) return undefined;

    return this.permissions.map((id) => ({
      permission: {
        connect: {
          id,
        },
      },
    }));
  }
}
