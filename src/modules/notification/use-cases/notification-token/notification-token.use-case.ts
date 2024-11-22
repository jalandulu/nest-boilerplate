import { Injectable } from '@nestjs/common';
import { NotificationTokenService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { GenerateNotificationTokenRequest, UpsertNotificationTokenRequest } from '../../requests';
import { CreateNotificationTokenDto } from 'src/cores/dtos';

@Injectable()
export class NotificationTokenUseCase {
  constructor(private readonly notificationTokenService: NotificationTokenService) {}

  @Transactional()
  async generate(generateRequest: GenerateNotificationTokenRequest) {
    return await this.notificationTokenService.upsert(
      new CreateNotificationTokenDto({
        userId: generateRequest.userId,
        type: generateRequest.type,
      }),
    );
  }

  @Transactional()
  async upsert(upsertRequest: UpsertNotificationTokenRequest) {
    return await this.notificationTokenService.upsert(
      new CreateNotificationTokenDto({
        userId: upsertRequest.userId,
        type: upsertRequest.type,
      }),
    );
  }
}
