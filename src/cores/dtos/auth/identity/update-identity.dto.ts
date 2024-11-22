import { Prisma } from '@prisma/client';
import { Hash } from 'src/common/helpers';
import { IUpdateIdentityDto } from 'src/cores/interfaces/dtos';

export class UpdateIdentityDto implements IUpdateIdentityDto {
  roleId?: number;
  username?: string;
  password?: string;
  permissionIds?: number[];

  constructor(payload: IUpdateIdentityDto) {
    Object.assign(this, payload);
  }

  get permissionsToPrisma():
    | Prisma.PermissionsOnIdentitiesUncheckedCreateWithoutIdentityInput[]
    | undefined {
    if (!this.permissionIds) return undefined;

    return this.permissionIds.map((id) => ({
      permissionId: id,
    }));
  }

  get hashPassword(): Promise<string> | undefined {
    if (!this.password) return undefined;
    return Hash.make(this.password);
  }
}
