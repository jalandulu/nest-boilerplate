import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessAuthGuard } from 'src/middlewares/guards';
import { IMailerServiceProvider, IQueueServiceProvider } from 'src/cores/contracts';
import { QueueMailerProcessor } from 'src/cores/consts';

@ApiTags('Email')
@UseGuards(AccessAuthGuard)
@Controller({
  path: 'email',
  version: '1.0',
})
export class EmailController {
  constructor(
    private readonly mailerProvider: IMailerServiceProvider,
    private readonly queueProvider: IQueueServiceProvider,
  ) {}

  @Post('send')
  async send() {
    await this.queueProvider.mailer.add(QueueMailerProcessor.sendEmail, {
      to: 'template@gmail.com',
      template: 'email-verification',
      context: {
        link: 'http://localhost:3000',
      },
    });
  }
}
