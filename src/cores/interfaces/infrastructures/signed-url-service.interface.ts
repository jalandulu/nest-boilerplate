import { SignMethodOptions } from 'signed';

export interface ISignSignedUrlOption extends SignMethodOptions {
  data?: string;
}

export interface IVerifySignedUrlOption {
  method?: string;
  addr?: string;
}
