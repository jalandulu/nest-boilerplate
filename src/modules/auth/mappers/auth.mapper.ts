import { Injectable } from '@nestjs/common';
import {
  AuthEntity,
  AuthMap,
  AuthUserEntity,
  AuthUserMap,
  NotificationTokenEntity,
} from 'src/cores/entities';
import { FileMapper } from 'src/modules/storage/mappers';

@Injectable()
export class AuthMapper {
  constructor(private readonly fileMapper: FileMapper) {}

  async profileMap(profile: AuthUserMap): Promise<AuthUserEntity> {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      picture: profile.picture
        ? (await this.fileMapper.toMap(profile.picture)).data
        : null,
    };
  }

  notificationTokenMap(token: NotificationTokenEntity) {
    return {
      type: token.type,
      token: token.token,
    };
  }

  async toMap(auth: AuthMap): Promise<{ data: AuthEntity }> {
    return {
      data: {
        profile: await this.profileMap(auth.profile),
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
        notificationTokens: auth.profile.notificationTokens
          ? auth.profile.notificationTokens.map((t) =>
              this.notificationTokenMap(t),
            )
          : undefined,
        abilities: auth.abilities,
      },
    };
  }
}
