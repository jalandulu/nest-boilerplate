import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { AuthService, IdentityService, RoleService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { UserService } from 'src/services/user/user.service';
import { RegisterRequest } from '../requests';
import { UserType } from 'src/cores/enums';
import { FastifyRequest } from 'fastify';
import { CreateIdentityDto } from 'src/cores/dtos';
import { AuthUserMap, RoleResourceMap } from 'src/cores/entities';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    private readonly identityService: IdentityService,
  ) {}

  @Transactional()
  async register(request: FastifyRequest, payload: RegisterRequest) {
    const origin = request.headers.origin;
    if (!origin) {
      throw new UnprocessableEntityException('undefined origin hostname');
    }

    const role = await this.roleService.findBySlug<RoleResourceMap>('admin', {
      permissionsOnRoles: {
        include: {
          permission: true,
        },
      },
    });

    const user = await this.userService.create<AuthUserMap>(
      {
        type: UserType.Operator,
        name: payload.name,
        email: payload.email,
      },
      {
        picture: true,
        notificationTokens: true,
      },
    );

    const identity = await this.identityService.create(
      new CreateIdentityDto({
        userId: user.id,
        roleId: role.id,
        username: payload.email,
        password: payload.password,
        permissionIds: role.permissionsOnRoles.map((p) => p.permissionId),
      }),
    );

    const authenticated = await this.authService.attempt({
      localAuth: {
        id: identity.id,
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

    const emailVerificationUrl = await this.authService.verifyEmailStrategy(
      identity.id,
      `${origin}/auth/verification-email/verify`,
    );

    return { user, role, authenticated, abilities, emailVerificationUrl };
  }
}
