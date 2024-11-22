import { Injectable } from '@nestjs/common';
import { UpdateAccountPasswordRequest, UpdateAccountRequest } from '../requests';
import { Transactional } from '@nestjs-cls/transactional';
import { Generate } from 'src/common/helpers';
import { AuthService, IdentityService } from 'src/services';
import { SetIdentityPasswordDto } from 'src/cores/dtos';

@Injectable()
export class AccountCredentialUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly identityService: IdentityService,
  ) {}

  @Transactional()
  async updateUsername(userId: string, payload: UpdateAccountRequest) {
    const before = await this.identityService.findOne(userId);

    const after = await this.identityService.updateUsername(userId, {
      username: payload.username,
    });

    await this.authService.updateUser(after.id, { email: after.username });

    return {
      before: before.username,
      after: after.username,
    };
  }

  @Transactional()
  async resetPassword(userId: string) {
    const password = Generate.randomString();

    const updated = await this.identityService.updatePassword(
      userId,
      new SetIdentityPasswordDto({
        password: password,
      }),
    );

    await this.authService.destroy(userId);

    return {
      credential: {
        username: updated.username,
        password: password,
      },
    };
  }

  @Transactional()
  async updatePassword(userId: string, { password }: UpdateAccountPasswordRequest) {
    const updated = await this.identityService.updatePassword(
      userId,
      new SetIdentityPasswordDto({
        password: password,
      }),
    );

    await this.authService.destroy(userId);

    return {
      credential: {
        username: updated.username,
        password: password,
      },
    };
  }
}
