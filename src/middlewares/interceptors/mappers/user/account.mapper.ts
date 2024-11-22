import { Injectable } from '@nestjs/common';
import {
  IPaginationMetaEntity,
  AccountEntity,
  AccountMap,
  AccountsMap,
  UserMap,
  RoleMap,
  PermissionsMap,
  AccountResourceMap,
  UserEntity,
  RoleEntity,
  PermissionEntity,
} from 'src/cores/entities';
import { UserMapper } from './user.mapper';
import { PermissionMapper, RoleMapper } from '../access';

@Injectable()
export class AccountMapper {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly roleMapper: RoleMapper,
    private readonly permissionMapper: PermissionMapper,
  ) {}

  async userMap(user: UserMap): Promise<UserEntity> {
    return await this.userMapper.toMap(user);
  }

  roleMap(role: RoleMap): RoleEntity {
    return this.roleMapper.toMap(role);
  }

  permissionMap(permission: PermissionsMap): PermissionEntity[] {
    return this.permissionMapper.toCollection(permission);
  }

  async toMap(account: AccountMap): Promise<AccountEntity> {
    return {
      id: account.id,
      name: account.user.name,
      username: account.username,
      status: account.status,
      role: account?.role ? this.roleMap(account.role) : undefined,
      user: account?.user ? await this.userMap(account.user) : undefined,
      disabledAt: account.disabledAt?.toISOString() || null,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    };
  }

  async toResource(account: AccountResourceMap): Promise<AccountEntity> {
    return {
      ...(await this.toMap(account)),
      permissions: this.permissionMap(account?.permissionsOnIdentities.map((p) => p.permission)),
    };
  }

  async toCollection(users: AccountsMap): Promise<AccountEntity[]> {
    return await Promise.all(users.map((i) => this.toMap(i)));
  }

  async toPaginate(data: AccountsMap, meta: IPaginationMetaEntity) {
    return {
      data: await this.toCollection(data),
      meta,
    };
  }
}
