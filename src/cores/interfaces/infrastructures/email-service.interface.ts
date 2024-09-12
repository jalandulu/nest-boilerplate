import { ISendMailOptions } from '@nestjs-modules/mailer';
import { EmailTemplate } from 'src/infrastructures/mailer';

export type EmailTemplateType = (typeof EmailTemplate)[number];

export interface MailMessage extends ISendMailOptions {
  template: EmailTemplateType;
}
