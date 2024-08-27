import { Injectable } from '@nestjs/common';
import {
  ISendMailOptions,
  MailerService as NodeMailerService,
} from '@nestjs-modules/mailer';
import { IMailerServiceProvider } from 'src/cores/contracts';

@Injectable()
export class NodemailerService implements IMailerServiceProvider {
  constructor(private readonly mailerService: NodeMailerService) {}

  async send(options: ISendMailOptions): Promise<void> {
    await this.mailerService.sendMail(options);
  }
}
