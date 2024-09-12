import { Injectable } from '@nestjs/common';
import {
  AuthEntity,
  AuthMap,
  AuthRoleEntity,
  AuthUserEntity,
  AuthUserMap,
  NotificationTokenEntity,
  ProfileEntity,
} from 'src/cores/entities';
import { FileMapper } from 'src/modules/storage/mappers';

@Injectable()
export class AuthMapper {
  constructor(private readonly fileMapper: FileMapper) {}

  notificationTokenMap(token: NotificationTokenEntity) {
    return {
      type: token.type,
      token: token.token,
    };
  }

  async userMap(
    profile: AuthUserMap,
    role?: AuthRoleEntity,
  ): Promise<AuthUserEntity> {
    return {
      id: profile.id,
      type: profile.type,
      name: profile.name,
      email: profile.email,
      emailVerifiedAt: profile.emailVerifiedAt?.toString() || null,
      picture: profile.picture
        ? (await this.fileMapper.toMap(profile.picture)).data
        : null,
      role: {
        id: role.id,
        name: role.name,
        slug: role.slug,
        visible: role.visible,
      },
      notificationTokens: profile.notificationTokens
        ? profile.notificationTokens.map((t) => this.notificationTokenMap(t))
        : undefined,
      createdAt: profile.createdAt.toString(),
      updatedAt: profile.updatedAt.toString(),
    };
  }

  async profileMap(
    auth: Pick<AuthMap, 'profile' | 'abilities'>,
    role: AuthRoleEntity,
  ): Promise<{ data: ProfileEntity }> {
    return {
      data: {
        profile: await this.userMap(auth.profile, role),
        abilities: auth.abilities,
      },
    };
  }

  async toMap(
    auth: AuthMap,
    role: AuthRoleEntity,
  ): Promise<{ data: AuthEntity }> {
    return {
      data: {
        profile: await this.userMap(auth.profile, role),
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
        abilities: auth.abilities,
      },
    };
  }
}
