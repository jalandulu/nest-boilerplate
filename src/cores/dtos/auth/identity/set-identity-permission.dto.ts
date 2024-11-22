import { Prisma } from '@prisma/client';
import { ICreateIdentityDto } from 'src/cores/interfaces/dtos';

export class SetIdentityPermissionDto implements Pick<ICreateIdentityDto, 'permissionIds'> {
  permissionIds: number[];

  constructor(payload: Pick<ICreateIdentityDto, 'permissionIds'>) {
    this.permissionIds = payload.permissionIds;
  }

  get permissionsToPrisma(): Prisma.PermissionsOnIdentitiesUncheckedCreateWithoutIdentityInput[] {
    return this.permissionIds.map((id) => ({
      permissionId: id,
    }));
  }
}
