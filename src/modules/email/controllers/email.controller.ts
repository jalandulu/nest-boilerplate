import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/middlewares/guards';
import { IMailerServiceProvider } from 'src/cores/contracts';

@ApiTags('Email')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'email',
  version: '1.0',
})
export class EmailController {
  constructor(private readonly mailerProvider: IMailerServiceProvider) {}

  @Post('send')
  async send() {
    await this.mailerProvider.send({
      to: 'user@email.com',
      template: 'email',
      context: {
        link: 'http://localhost:3000',
      },
    });
  }
}
