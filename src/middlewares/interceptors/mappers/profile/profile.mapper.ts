import { Injectable } from '@nestjs/common';
import {
  AuthUserMap,
  FileEntity,
  FileMap,
  NotificationTokenEntity,
  ProfileEntity,
  RoleMap,
} from 'src/cores/entities';
import { FileMapper } from '../storage';
import { RoleMapper } from '../access';
import { NotificationTokenMapper } from '../notification';

@Injectable()
export class ProfileMapper {
  constructor(
    private readonly fileMapper: FileMapper,
    private readonly roleMapper: RoleMapper,
    private readonly tokenMapper: NotificationTokenMapper,
  ) {}

  async pictureMap(picture: FileMap | null): Promise<FileEntity> {
    if (!picture) return null;

    return await this.fileMapper.toMap(picture, { public: true });
  }

  notificationTokenMap(tokens: NotificationTokenEntity[] | undefined): NotificationTokenEntity[] {
    if (!tokens || tokens.length < 1) return [];

    return this.tokenMapper.toCollection(tokens);
  }

  async toMap(user: AuthUserMap, role?: RoleMap): Promise<ProfileEntity> {
    return {
      id: user.id,
      type: user.type,
      name: user.name,
      email: user.email,
      emailVerifiedAt: user.emailVerifiedAt?.toISOString() || null,
      picture: await this.pictureMap(user?.picture),
      role: this.roleMapper.toMap(role),
      notificationTokens: this.notificationTokenMap(user.notificationTokens),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
