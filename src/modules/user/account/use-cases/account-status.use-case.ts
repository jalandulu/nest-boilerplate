import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { AuthService, IdentityService } from 'src/services';
import { SetIdentityStatusDto } from 'src/cores/dtos/auth/identity/set-identity-status.dto';

@Injectable()
export class AccountStatusUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly identityService: IdentityService,
  ) {}

  @Transactional()
  async enable(userId: string) {
    const isActive = await this.identityService.isActive(userId);
    if (isActive) {
      throw new UnprocessableEntityException(`account is already activated.`);
    }

    return await this.identityService.updateStatus(
      userId,
      new SetIdentityStatusDto({ enable: true }),
    );
  }

  @Transactional()
  async disable(userId: string) {
    const isActive = await this.identityService.isActive(userId);
    if (!isActive) {
      throw new UnprocessableEntityException(`account is already deactivated.`);
    }

    return await this.identityService.updateStatus(
      userId,
      new SetIdentityStatusDto({ enable: false }),
    );
  }

  @Transactional()
  async status(userId: string) {
    const currentStatus = await this.identityService.isActive(userId);

    const updated = await this.identityService.updateStatus(
      userId,
      new SetIdentityStatusDto({ enable: !currentStatus }),
    );

    if (!currentStatus) {
      await this.authService.destroy(userId);
    }

    return updated;
  }
}
