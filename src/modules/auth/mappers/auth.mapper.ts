import { Injectable } from '@nestjs/common';
import {
  AuthEntity,
  AuthMap,
  AuthUserEntity,
  AuthUserMap,
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

  async toMap(auth: AuthMap): Promise<{ data: AuthEntity }> {
    return {
      data: {
        profile: await this.profileMap(auth.profile),
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
        abilities: auth.abilities,
      },
    };
  }
}
