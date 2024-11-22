import { Injectable } from '@nestjs/common';
import { NotificationService } from 'src/services';
import {
  QueryNotificationRequest,
  ReadNotificationRequest,
  RemoveNotificationRequest,
} from '../../requests';

@Injectable()
export class NotificationUseCase {
  constructor(private readonly notificationService: NotificationService) {}

  async findAll(notificationRequest: QueryNotificationRequest) {
    return await this.notificationService.findByNotifiable(notificationRequest);
  }

  async readMany(notificationRequest: ReadNotificationRequest) {
    return await this.notificationService.readByNotifiable(notificationRequest);
  }

  async read(id: number) {
    return await this.notificationService.read(id);
  }

  async remove(id: number) {
    return await this.notificationService.remove(id);
  }

  async removeForce(id: number) {
    return await this.notificationService.removeForce(id);
  }

  async removeMany(notificationRequest: RemoveNotificationRequest) {
    return await this.notificationService.removeByNotifiable(notificationRequest);
  }

  async removeForceMany(notificationRequest: RemoveNotificationRequest) {
    return await this.notificationService.removeForceByNotifiable(notificationRequest);
  }
}
