import * as path from 'path';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { IMailServiceEnv } from 'src/cores/interfaces';

@Injectable()
export class NodemailerConfigService implements MailerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  private get _transport(): MailerOptions['transport'] {
    const smtp = this.configService.get<IMailServiceEnv>('smtp');

    return {
      host: smtp.host,
      port: smtp.port,
      ignoreTLS: smtp.ignoreTLS,
      secure: smtp.secure,
      auth: {
        user: smtp.username,
        pass: smtp.password,
      },
    };
  }

  createMailerOptions(): MailerOptions | Promise<MailerOptions> {
    const from = this.configService.get<IMailServiceEnv['from']>('smtp.from');

    return {
      transport: this._transport,
      defaults: {
        from: {
          name: from.name,
          address: from.address,
        },
      },
      template: {
        dir: path.join(process.env.PWD, 'dist/src/infrastructures/mailer/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}
