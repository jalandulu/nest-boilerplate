import { Prisma } from '@prisma/client';
import { FileEntity } from './storage.entity';

export type UserMap = Prisma.UserGetPayload<{
  include: {
    picture: true;
  };
}>;

export type UsersMap = UserMap[];

export type UserEntity = {
  id: string;
  type: string;
  name: string;
  email: string;
  picture?: FileEntity;
  emailVerifiedAt: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};
