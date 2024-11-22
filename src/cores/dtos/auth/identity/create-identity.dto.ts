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
    Object.assign(this, payload);
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
