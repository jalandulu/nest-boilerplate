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

  private async pictureMap(picture: FileMap | null): Promise<FileEntity> {
    if (!picture) return null;

    return (await this.fileMapper.toMap(picture)).data;
  }

  async toMap(user: UserMap): Promise<{ data: UserEntity }> {
    return {
      data: {
        id: user.id,
        type: user.type,
        name: user.name,
        email: user.email,
        emailVerifiedAt: user.emailVerifiedAt?.toISOString() || null,
        picture: await this.pictureMap(user?.picture),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  }

  async toCollection(users: UsersMap) {
    const mapper = await Promise.all(users.map((user) => this.toMap(user)));

    return {
      data: mapper.map(({ data }) => data),
    };
  }

  async toPaginate(data: UsersMap, meta: IPaginationMetaEntity) {
    return {
      data: (await this.toCollection(data)).data,
      meta,
    };
  }
}
