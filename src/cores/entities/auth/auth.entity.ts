import { Prisma } from '@prisma/client';
import { FileEntity } from '../storage.entity';
import { NotificationTokenEntity } from '../notification.entity';
import { RoleEntity, RoleMap } from '../access';

export type AuthUserMap = Prisma.UserGetPayload<{
  include: {
    picture: true;
    notificationTokens: true;
  };
}>;

export type AuthEntity = {
  profile: ProfileEntity;
  accessToken: string;
  accessTokenExpAt: number;
  refreshToken?: string;
  refreshTokenExpAt?: number;
  abilities: string[];
};

export type JwtEntity = {
  sub: string;
  username: string;
  scope: string;
  abilities?: string[];
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
  roleId: number;
  username: string;
  password: string;
  isActive: Date;
  user: AuthUserMap;
  role?: RoleMap;
  permissions: AuthPermissionEntity[];
};

export type AuthPermissionEntity = {
  id: number;
  slug: string;
};

export type ProfileEntity = {
  id: string;
  type: string;
  name: string;
  email: string;
  emailVerifiedAt?: string;
  picture: FileEntity;
  role?: RoleEntity;
  createdAt: string;
  updatedAt: string;
  notificationTokens?: NotificationTokenEntity[];
};
