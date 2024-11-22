import { Injectable } from '@nestjs/common';
import {
  FileEntity,
  FileMap,
  IPaginationMetaEntity,
  UserEntity,
  UserMap,
  UsersMap,
} from 'src/cores/entities';
import { FileMapper } from '../storage';

@Injectable()
export class UserMapper {
  constructor(private readonly fileMapper: FileMapper) {}

  private async pictureMap(picture: FileMap | null): Promise<FileEntity | null> {
    if (!picture) return null;

    return await this.fileMapper.toMap(picture, { public: true });
  }

  async toMap(user: UserMap): Promise<UserEntity> {
    return {
      id: user.id,
      type: user.type,
      name: user.name,
      email: user.email,
      emailVerifiedAt: user.emailVerifiedAt?.toISOString() || null,
      picture: await this.pictureMap(user.picture),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async toCollection(users: UsersMap): Promise<UserEntity[]> {
    return await Promise.all(users.map((user) => this.toMap(user)));
  }

  async toPaginate(data: UsersMap, meta: IPaginationMetaEntity) {
    return {
      data: await this.toCollection(data),
      meta,
    };
  }
}
