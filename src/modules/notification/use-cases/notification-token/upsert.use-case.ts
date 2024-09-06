import { Injectable } from '@nestjs/common';
import { NotificationTokenService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { UpsertNotificationTokenRequest } from '../../requests';
import { Prisma } from '@prisma/client';

@Injectable()
export class UpsertNotifiationTokenUseCase {
  constructor(
    private readonly notificationTokenService: NotificationTokenService,
  ) {}

  @Transactional()
  async upsert(upsertRequest: UpsertNotificationTokenRequest) {
    const exist = await this.notificationTokenService.findOne<
      Prisma.NotificationTokenGetPayload<Prisma.NotificationDefaultArgs>
    >({
      userId: upsertRequest.userId,
      type: upsertRequest.type,
    });

    if (exist) {
      return await this.notificationTokenService.update(exist.id, {
        token: upsertRequest.token,
      });
    }

    return await this.notificationTokenService.create({
      userId: upsertRequest.userId,
      type: upsertRequest.type,
      token: upsertRequest.token,
    });
  }
}
