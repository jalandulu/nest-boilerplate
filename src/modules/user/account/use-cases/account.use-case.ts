import { Injectable } from '@nestjs/common';
import { CreateAccountRequest, QueryAccountRequest, UpdateAccountRequest } from '../requests';
import { Transactional } from '@nestjs-cls/transactional';
import { Generate } from 'src/common/helpers';
import { AuthService, IdentityService, RoleService, UserService } from 'src/services';
import {
  AccountMap,
  AccountResourceMap,
  ProfileEntity,
  RoleResourceMap,
  UserMap,
} from 'src/cores/entities';
import { CreateIdentityDto, QueryIdentityDto } from 'src/cores/dtos';

@Injectable()
export class AccountUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly identityService: IdentityService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  async findAll(query: QueryAccountRequest, profile: ProfileEntity) {
    return await this.identityService.findAll(new QueryIdentityDto(profile.id, query));
  }

  async findOne(userId: string) {
    return await this.identityService.findOne<AccountResourceMap>(userId, {
      role: true,
      user: {
        include: {
          picture: true,
        },
      },
      permissionsOnIdentities: {
        include: {
          permission: true,
        },
      },
    });
  }

  @Transactional()
  async create(payload: CreateAccountRequest) {
    if (!payload.password) {
      payload.password = Generate.randomString();
    }

    const [user, role] = await Promise.all([
      this.userService.findOne<UserMap>(payload.userId, {
        picture: true,
      }),
      this.roleService.findOne<RoleResourceMap>(payload.roleId, {
        permissionsOnRoles: true,
      }),
    ]);

    if (!payload.permissions || payload.permissions.length < 1) {
      payload.permissions = role.permissionsOnRoles.map((por) => por.permissionId);
    }

    const created = await this.identityService.upsert(
      new CreateIdentityDto({
        userId: payload.userId,
        roleId: role.id,
        username: user.email,
        password: payload.password,
        permissionIds: payload.permissions,
      }),
    );

    const account: AccountMap = {
      ...created,
      role: role,
      user: user,
    };

    return {
      account: account,
      credential: {
        username: created.username,
        password: payload.password,
      },
    };
  }

  @Transactional()
  async update(userId: string, payload: UpdateAccountRequest) {
    const updated = await this.identityService.updateUsername(userId, {
      username: payload.username,
    });

    await this.authService.updateUser(updated.id, { email: updated.username });

    return updated;
  }

  @Transactional()
  async destroy(userId: string) {
    const removed = await this.identityService.remove(userId);

    await this.authService.destroy(removed.id);

    return removed;
  }
}
