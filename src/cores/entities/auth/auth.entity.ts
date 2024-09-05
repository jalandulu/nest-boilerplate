import { Prisma } from '@prisma/client';
import { FileEntity } from '../storage.entity';

export type AuthUserMap = Prisma.UserGetPayload<{
  include: {
    picture: true;
  };
}>;

export type AuthMap = {
  profile: AuthUserMap;
  accessToken: string;
  refreshToken?: string;
  abilities: string[];
};

export type JwtEntity = {
  sub: string;
  username: string;
  scope: string;
  permissions?: string[];
  iat: number;
  exp: number;
  aud: string;
  iss: string;
};

export type TokenEntity = {
  accessToken: string;
  rememberMeToken: string;
};

export type LocalAuthEntity = {
  id: string;
  userId: string;
  roleId: number;
  username: string;
  password: string;
  isActive: Date;
  user: AuthUserMap;
  role: AuthRoleEntity;
  permissions: AuthPermissionEntity[];
};

export type AuthEntity = {
  profile: AuthUserEntity;
  accessToken: string;
  refreshToken?: string;
  abilities: string[];
};

export type AuthPermissionEntity = {
  id: number;
  slug: string;
};

export type AuthRoleEntity = {
  id: number;
  name: string;
  slug: string;
  visible: boolean;
};

export type AuthUserEntity = {
  id: string;
  name: string;
  email: string;
  picture: FileEntity;
};
