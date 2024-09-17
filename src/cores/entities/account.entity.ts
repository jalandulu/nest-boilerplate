import { Prisma } from '@prisma/client';
import { RoleEntity } from './access';
import { UserEntity } from './user.entity';

export type AccountMap = Prisma.IdentityGetPayload<{
  include: {
    role: true;
    user: {
      include: { picture: true };
    };
  };
}>;

export type AccountsMap = AccountMap[];

export type AccountEntity = {
  id: string;
  username: string;
  status: string;
  role: RoleEntity;
  user?: UserEntity;
  disabledAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};
