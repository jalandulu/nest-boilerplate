import { Injectable } from '@nestjs/common';
import {
  BatchResponse,
  Message,
} from 'firebase-admin/lib/messaging/messaging-api';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { INotificationServiceProvider } from 'src/cores/contracts';

@Injectable()
export class FirebaseService implements INotificationServiceProvider {
  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {}

  async send(options: Message, dryRun?: boolean): Promise<string> {
    return await this.firebase.messaging.send(options, dryRun);
  }

  async sendEach(options: Message[], dryRun?: boolean): Promise<BatchResponse> {
    return await this.firebase.messaging.sendEach(options, dryRun);
  }
}
