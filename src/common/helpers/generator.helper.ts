import { randomBytes } from 'crypto';
import * as mime from 'mime-types';

export namespace Generate {
  export function fileName(mimetype: string): string {
    const ext = mime.extension(mimetype);
    return randomBytes(16).toString('hex') + '.' + ext;
  }

  export function randomString(size: number = 16) {
    return randomBytes(size).toString('hex');
  }

  export function verificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
