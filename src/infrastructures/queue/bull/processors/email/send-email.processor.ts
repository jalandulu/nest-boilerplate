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
  async handle(job: Job<{ link?: string }>) {
    this.logger.verbose(`Queue Start: ${QueueMailerProcessor.SendEmail}`);

    const link = job.data.link ?? 'http://localhost:3000';

    this.logger.verbose(`Queue Data: ${JSON.stringify(job.data)}`);

    await this.mailer.send({
      to: 'boilerplate@nestjs.com',
      subject: 'Email',
      template: 'email',
      context: {
        link: link,
      },
    });

    this.logger.verbose(`Queue Completed: ${QueueMailerProcessor.SendEmail}`);
  }
}
