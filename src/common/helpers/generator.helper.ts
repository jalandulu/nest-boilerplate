import { randomBytes } from 'crypto';
import * as mime from 'mime-types';

export namespace Generate {
  export function fileName(mimetype: string): string {
    const ext = mime.extension(mimetype);
    return randomBytes(16).toString('hex') + '.' + ext;
  }
}
