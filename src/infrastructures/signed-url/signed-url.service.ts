import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ISignatureEnv,
  ISignSignedUrlOption,
  IVerifySignedUrlOption,
} from 'src/cores/interfaces';
import signed, { Signature, SignatureError } from 'signed';
import { ISignedUrlServiceProvider } from 'src/cores/contracts';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'node:crypto';
import { URL } from 'node:url';

@Injectable()
export class SignedUrlService implements ISignedUrlServiceProvider {
  public readonly signature: Signature;
  private readonly signatureConfig: ISignatureEnv;

  constructor(private readonly configService: ConfigService) {
    this.signatureConfig = this.configService.get<ISignatureEnv>('app');
    this.signature = signed({
      secret: this.signatureConfig.key,
      ttl: this.signatureConfig.ttl,
    });
  }

  sign(url: string, options?: ISignSignedUrlOption) {
    const signatureUrl = new URL(this.signature.sign(url, options));

    if (options.data) {
      const token = this.encrypt(options.data);
      signatureUrl.searchParams.append('token', token);
    }

    return signatureUrl.href;
  }

  verify(url: string, options?: IVerifySignedUrlOption) {
    try {
      const signatureUrl = new URL(url);
      const encryptedData = signatureUrl.searchParams.get('token');
      signatureUrl.searchParams.delete('token');

      const verify = this.signature.verify(signatureUrl.href, options);
      if (!verify) {
        throw new SignatureError('signature url is undefined', 422);
      }

      if (encryptedData) {
        const data = this.decrypt(encryptedData);
        return {
          url: url,
          data: data,
        };
      }

      return {
        url: url,
        data: null,
      };
    } catch (error) {
      throw error;
    }
  }

  private encrypt(data: string) {
    const initializationVector = randomBytes(16);
    const hashedEncryptionKey = createHash('sha256')
      .update(this.signatureConfig.key)
      .digest('hex')
      .substring(0, 32);

    const cipher = createCipheriv(
      'aes256',
      hashedEncryptionKey,
      initializationVector,
    );

    let encryptedData = cipher.update(Buffer.from(data, 'utf-8'));
    encryptedData = Buffer.concat([encryptedData, cipher.final()]);

    return `${initializationVector.toString('hex')}.${encryptedData.toString(
      'hex',
    )}`;
  }

  private decrypt(encryptedData: string) {
    const [initializationVectorAsHex, encryptedDataAsHex] =
      encryptedData?.split('.');
    const initializationVector = Buffer.from(initializationVectorAsHex, 'hex');

    const hashedEncryptionKey = createHash('sha256')
      .update(this.signatureConfig.key)
      .digest('hex')
      .substring(0, 32);

    const decipher = createDecipheriv(
      'aes256',
      hashedEncryptionKey,
      initializationVector,
    );

    let decryptedText = decipher.update(Buffer.from(encryptedDataAsHex, 'hex'));
    decryptedText = Buffer.concat([decryptedText, decipher.final()]);

    return decryptedText.toString();
  }
}
