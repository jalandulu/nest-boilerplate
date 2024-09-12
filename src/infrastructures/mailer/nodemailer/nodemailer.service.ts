import { Injectable } from '@nestjs/common';
import { MailerService as NodeMailerService } from '@nestjs-modules/mailer';
import { IMailerServiceProvider } from 'src/cores/contracts';
import { MailMessage } from 'src/cores/interfaces';

@Injectable()
export class NodemailerService implements IMailerServiceProvider {
  constructor(private readonly mailerService: NodeMailerService) {}

  async send(options: MailMessage): Promise<void> {
    await this.mailerService.sendMail(options);
  }
}
