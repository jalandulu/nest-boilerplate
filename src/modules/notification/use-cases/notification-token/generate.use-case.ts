import { Injectable } from '@nestjs/common';
import { NotificationTokenService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { GenerateNotificationTokenRequest } from '../../requests';

@Injectable()
export class GenerateNotifiationTokenUseCase {
  constructor(
    private readonly notificationTokenService: NotificationTokenService,
  ) {}

  @Transactional()
  async generate(generateRequest: GenerateNotificationTokenRequest) {
    return await this.notificationTokenService.createTokenAndSave({
      userId: generateRequest.userId,
      type: generateRequest.type,
    });
  }
}
