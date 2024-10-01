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

  async userMap(user: UserMap) {
    return (await this.userMapper.toMap(user)).data;
  }

  roleMap(role: RoleMap) {
    return this.roleMapper.toMap(role).data;
  }

  permissionMap(permission: PermissionsMap) {
    return this.permissionMapper.toCollection(permission).data;
  }

  async toMap(account: AccountMap): Promise<{ data: AccountEntity }> {
    return {
      data: {
        id: account.id,
        name: account.user.name,
        username: account.username,
        status: account.status,
        role: account?.role ? await this.roleMap(account.role) : undefined,
        user: account?.user ? await this.userMap(account.user) : undefined,
        disabledAt: account.disabledAt?.toISOString(),
        createdAt: account.createdAt.toISOString(),
        updatedAt: account.updatedAt.toISOString(),
      },
    };
  }

  async toResource(
    account: AccountResourceMap,
  ): Promise<{ data: AccountEntity }> {
    return {
      data: {
        id: account.id,
        name: account.user.name,
        username: account.username,
        status: account.status,
        role: account?.role ? await this.roleMap(account.role) : undefined,
        user: account?.user ? await this.userMap(account.user) : undefined,
        permissions: this.permissionMap(
          account?.permissionsOnIdentities.map((p) => p.permission),
        ),
        disabledAt: account.disabledAt?.toISOString(),
        createdAt: account.createdAt.toISOString(),
        updatedAt: account.updatedAt.toISOString(),
      },
    };
  }

  async toCollection(users: AccountsMap) {
    const mapper = await Promise.all(users.map((user) => this.toMap(user)));

    return {
      data: mapper.map(({ data }) => data),
    };
  }

  async toPaginate(data: AccountsMap, meta: IPaginationMetaEntity) {
    return {
      data: (await this.toCollection(data)).data,
      meta,
    };
  }
}
