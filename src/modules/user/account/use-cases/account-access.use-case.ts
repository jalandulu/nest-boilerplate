import { Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { AuthService, IdentityService, PermissionService } from 'src/services';
import { UpdateAccountAccessRequest } from '../requests';
import { SetIdentityStatusDto, SetIdentityPermissionDto } from 'src/cores/dtos';
import { AccountMap } from 'src/cores/entities';

@Injectable()
export class AccountAccessUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly identityService: IdentityService,
    private readonly permissionService: PermissionService,
  ) {}

  @Transactional()
  async access(userId: string, payload: UpdateAccountAccessRequest) {
    const account = await this.identityService.findOne<AccountMap>(userId, {
      role: true,
    });

    const parallel = [];

    if (account.role.id !== payload.roleId) {
      parallel.push(() => this.identityService.updateRole(userId, { roleId: payload.roleId }));
    }

    parallel.push(() =>
      this.identityService.updatePermission(
        userId,
        new SetIdentityPermissionDto({
          permissionIds: payload.permissions,
        }),
      ),
    );

    const [permissions] = await Promise.all([
      this.permissionService.findIn(payload.permissions),
      ...parallel.map((fn) => fn()),
    ]);

    await this.authService.setPermissions(
      userId,
      permissions.map((p) => p.slug),
    );

    return await this.identityService.updateStatus(
      userId,
      new SetIdentityStatusDto({ enable: true }),
    );
  }
}
