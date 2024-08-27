import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Queue } from 'bullmq';
import { IQueueServiceProvider } from 'src/cores/contracts';

@Injectable()
export class BullQueueService
  implements IQueueServiceProvider, OnApplicationBootstrap
{
  // notification: Queue<any>;
  mailer: Queue<any>;

  constructor(
    // @InjectQueue('notification') private readonly notificationQueue: Queue,
    @InjectQueue('mailer') private readonly mailerQueue: Queue,
  ) {}

  onApplicationBootstrap() {
    // this.notification = this.notificationQueue;
    this.mailer = this.mailerQueue;
  }
}
