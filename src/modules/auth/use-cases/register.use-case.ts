import { Injectable } from '@nestjs/common';
import { AuthService, IdentityService, RoleService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { UserService } from 'src/services/user/user.service';
import { RegisterRequest } from '../requests';
import { FileDirectoryService } from 'src/services/storage';
import { UserType } from 'src/cores/enums';
import { Prisma } from '@prisma/client';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    private readonly identityService: IdentityService,
    private readonly fileDirectoryService: FileDirectoryService,
  ) {}

  @Transactional()
  async register(registerRequest: RegisterRequest) {
    if (registerRequest.pictureId) {
      const picture = await this.fileDirectoryService.save({
        dirname: 'user-picture',
        fileId: registerRequest.pictureId,
      });

      registerRequest.pictureId = picture.id;
    }

    const role = await this.roleService.findBySlug<
      Prisma.RoleGetPayload<{
        include: {
          permissionsOnRoles: {
            include: {
              permission: true;
            };
          };
        };
      }>
    >('admin', {
      permissionsOnRoles: {
        include: {
          permission: true,
        },
      },
    });

    const user = await this.userService.create<
      Prisma.UserGetPayload<{
        include: {
          picture: true;
        };
      }>
    >(
      {
        type: UserType.Operator,
        name: registerRequest.name,
        email: registerRequest.email,
        pictureId: registerRequest.pictureId,
      },
      {
        picture: true,
      },
    );

    const identity = await this.identityService.create<
      Prisma.IdentityGetPayload<Prisma.IdentityDefaultArgs>
    >({
      userId: user.id,
      roleId: role.id,
      username: registerRequest.email,
      password: registerRequest.password,
      permissionIds: role.permissionsOnRoles.map((p) => p.permissionId),
    });

    const authenticated = await this.authService.attempt({
      localAuth: {
        id: identity.id,
        userId: identity.id,
        roleId: identity.roleId,
        username: identity.username,
        password: identity.password,
        isActive: identity.disabledAt,
        user: user,
        role: role,
        permissions: role.permissionsOnRoles.map((p) => p.permission),
      },
    });

    const abilities = role.permissionsOnRoles.map((p) => p.permission.slug);

    return { user, authenticated, abilities };
  }
}
