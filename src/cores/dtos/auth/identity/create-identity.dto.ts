import { Prisma } from '@prisma/client';
import { Hash } from 'src/common/helpers';
import { ICreateIdentityDto } from 'src/cores/interfaces/dtos';

export class CreateIdentityDto implements ICreateIdentityDto {
  userId: string;
  roleId: number;
  username: string;
  password: string;
  permissionIds?: number[];

  constructor(payload: ICreateIdentityDto) {
    this.userId = payload.userId;
    this.roleId = payload.roleId;
    this.username = payload.username;
    this.password = payload.password;
    this.permissionIds = payload.permissionIds;
  }

  get permissionsToPrisma():
    | Prisma.PermissionsOnIdentitiesUncheckedCreateWithoutIdentityInput[]
    | undefined {
    if (!this.permissionIds) return undefined;

    return this.permissionIds?.map((id) => ({
      permissionId: id,
    }));
  }

  get hashPassword(): Promise<string> {
    return Hash.make(this.password);
  }
}
