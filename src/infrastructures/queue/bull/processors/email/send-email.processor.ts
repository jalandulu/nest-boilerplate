import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QueueMailerProcessor } from 'src/cores/consts';
import { IMailerServiceProvider } from 'src/cores/contracts';

@Injectable()
@Processor('mailer')
export class SendEmailProcessor {
  private readonly logger = new Logger(SendEmailProcessor.name);

  constructor(private readonly mailer: IMailerServiceProvider) {}

  @Process(QueueMailerProcessor.SendEmail)
  async handle({ data }: Job<ISendMailOptions>) {
    this.logger.verbose(`Queue Start: ${QueueMailerProcessor.SendEmail}`);

    this.logger.verbose(`Queue Data: ${JSON.stringify(data)}`);
    await this.mailer.send(data);

    this.logger.verbose(`Queue Completed: ${QueueMailerProcessor.SendEmail}`);
  }
}
