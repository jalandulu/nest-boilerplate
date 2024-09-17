import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import {
  CreateAccountRequest,
  QueryUserRequest,
  UpdateAccountRequest,
} from '../requests';
import { Transactional } from '@nestjs-cls/transactional';
import { Generate } from 'src/common/helpers';
import { IdentityService, RoleService, UserService } from 'src/services';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AccountUseCase {
  constructor(
    private readonly identityService: IdentityService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  async findAll(query: QueryUserRequest) {
    return await this.identityService.findAll(query);
  }

  async findOne(userId: string) {
    return await this.identityService.findOne<
      Prisma.IdentityGetPayload<{
        include: {
          role: true;
          user: { include: { picture: true } };
        };
      }>
    >(userId, {
      user: {
        include: {
          picture: true,
        },
      },
      role: true,
    });
  }

  @Transactional()
  async create(userId: string, payload: CreateAccountRequest) {
    try {
      const exist = await this.identityService.findOne<
        Prisma.IdentityGetPayload<Prisma.IdentityDefaultArgs>
      >(userId);
      if (exist) {
        throw new UnprocessableEntityException('account is already exists');
      }

      const password = Generate.randomString();

      const [user, role] = await Promise.all([
        this.userService.findOne<
          Prisma.UserGetPayload<{
            include: {
              picture: true;
            };
          }>
        >(userId, {
          picture: true,
        }),
        this.roleService.findOne<
          Prisma.RoleGetPayload<{
            include: {
              permissionsOnRoles: true;
            };
          }>
        >(payload.roleId, {
          permissionsOnRoles: true,
        }),
      ]);

      const permissionIds = role.permissionsOnRoles.map(
        (por) => por.permissionId,
      );

      const created = await this.identityService.create<
        Prisma.IdentityGetPayload<Prisma.IdentityDefaultArgs>
      >({
        userId: userId,
        roleId: role.id,
        username: user.email,
        password: password,
        permissionIds: permissionIds,
      });

      const account: Prisma.IdentityGetPayload<{
        include: {
          role: true;
          user: { include: { picture: true } };
        };
      }> = {
        ...created,
        role: role,
        user: user,
      };

      return {
        account: account,
        credential: {
          username: created.username,
          password: password,
        },
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new UnprocessableEntityException('account is already exists');
        }
      }

      throw error;
    }
  }

  @Transactional()
  async update(userId: string, payload: UpdateAccountRequest) {
    return await this.identityService.updateUsername(userId, {
      username: payload.username,
    });
  }

  @Transactional()
  async reset(userId: string) {
    const password = Generate.randomString();

    const created = await this.identityService.updatePassword(userId, {
      password: password,
    });

    return {
      credential: {
        username: created.username,
        password: password,
      },
    };
  }

  @Transactional()
  async enable(userId: string) {
    const isActive = await this.identityService.isActive(userId);
    if (isActive) {
      throw new UnprocessableEntityException(`account is already activated.`);
    }

    return await this.identityService.updateStatus(userId, true);
  }

  @Transactional()
  async disable(userId: string) {
    const isActive = await this.identityService.isActive(userId);
    if (!isActive) {
      throw new UnprocessableEntityException(`account is already deactivated.`);
    }

    return await this.identityService.updateStatus(userId, false);
  }

  @Transactional()
  async destroy(userId: string) {
    return await this.identityService.remove(userId);
  }
}
