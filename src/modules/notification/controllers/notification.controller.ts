import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/middlewares/guards';
import { INotificationServiceProvider } from 'src/cores/contracts';

@ApiTags('Notification')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'notification',
  version: '1.0',
})
export class NotificationController {
  constructor(
    private readonly notificationProvider: INotificationServiceProvider,
  ) {}

  @Post('send')
  async send() {
    this.notificationProvider.send({
      token: '/token',
      data: {
        message: 'hello world!',
      },
    });
  }

  @Post('send-each')
  async sendEach() {
    this.notificationProvider.sendEach([
      {
        token: '/token',
        data: {
          message: 'hello world!',
        },
      },
      {
        token: '/token',
        data: {
          message: 'hello from mqtt5!',
        },
      },
    ]);
  }
}
