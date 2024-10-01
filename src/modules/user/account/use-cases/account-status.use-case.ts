import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { AuthService, IdentityService } from 'src/services';
import { Prisma } from '@prisma/client';

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
  async status(userId: string) {
    const identity = await this.identityService.findOne<
      Prisma.IdentityGetPayload<Prisma.IdentityDefaultArgs>
    >(userId);
    if (!identity) {
      throw new NotFoundException('Account not found.');
    }

    const currentStatus = identity.disabledAt === null ? false : true;
    const updated = await this.identityService.updateStatus(
      userId,
      currentStatus,
    );

    if (!currentStatus) {
      await this.authService.destroy(identity.id);
    }

    return updated;
  }
}
