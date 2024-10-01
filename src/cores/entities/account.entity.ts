import { Prisma } from '@prisma/client';
import { PermissionEntity, RoleEntity } from './access';
import { UserEntity } from './user.entity';

export type AccountMap = Prisma.IdentityGetPayload<{
  include: {
    role: true;
    user: {
      include: { picture: true };
    };
  };
}>;

export type AccountResourceMap = Prisma.IdentityGetPayload<{
  include: {
    role: true;
    user: {
      include: { picture: true };
    };
    permissionsOnIdentities: {
      include: { permission: true };
    };
  };
}>;

export type AccountsMap = AccountMap[];

export type AccountEntity = {
  id: string;
  name: string;
  username: string;
  status: string;
  role: RoleEntity;
  user?: UserEntity;
  permissions?: PermissionEntity[];
  disabledAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};
