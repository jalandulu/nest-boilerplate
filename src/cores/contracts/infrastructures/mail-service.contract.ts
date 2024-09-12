import { MailMessage } from 'src/cores/interfaces';

export abstract class IMailerServiceProvider {
  abstract send(options: MailMessage): Promise<void>;
}
