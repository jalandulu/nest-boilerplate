import { ISendMailOptions } from '@nestjs-modules/mailer';

export abstract class IMailerServiceProvider {
  abstract send(options: ISendMailOptions): Promise<void>;
}
