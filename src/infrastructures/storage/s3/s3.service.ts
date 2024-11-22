import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3ReadStream } from 's3-readstream/dist/S3Readstream';
import { IStorageServiceProvider } from 'src/cores/contracts';
import { IAppEnv, IStorageServiceEnv, IStorageSignedOption } from 'src/cores/interfaces';

@Injectable()
export class S3Service implements IStorageServiceProvider, OnApplicationBootstrap {
  private storage: S3Client;
  private bucket: string;
  private basePath: string;
  private config: IStorageServiceEnv;

  private readonly logger = new Logger(S3Service.name);

  constructor(private readonly configService: ConfigService) {}

  onApplicationBootstrap() {
    const configApp = this.configService.get<IAppEnv>('app');
    this.config = this.configService.get<IStorageServiceEnv>('s3');

    this.basePath = `${this.config.baseDir}/${configApp.mode}`;
    this.bucket = this.config.bucket;
    this.storage = new S3Client({
      endpoint: this.config.host,
      region: this.config.region ?? 'jkt-1',
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.accessKeySecret,
      },
    });
  }

  async upload(path: string, file: { buffer: Buffer; mimetype: string }) {
    const fullPath = `${this.basePath}/${path}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fullPath,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
    });

    this.logger.verbose(`S3 Write: ${JSON.stringify(command.input.Key)}`);

    try {
      const stored = await this.storage.send(command);

      return {
        path: path,
        basePath: this.basePath,
        fullPath: fullPath,
        stored: stored,
      };
    } catch (e) {
      throw e;
    }
  }

  publicUrl(path: string) {
    if (!this.config.url) {
      throw new InternalServerErrorException('Please provide S3_URL for public url');
    }

    return `${this.config.url}/${this.basePath}/${path}`;
  }

  async signedUrl(path: string, options?: IStorageSignedOption) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: `${this.basePath}/${path}`,
    });

    return await getSignedUrl(this.storage, command, {
      expiresIn: options?.expiresIn,
    });
  }

  async readStream(path: string) {
    const bucketParams = {
      Bucket: this.bucket,
      Key: `${this.basePath}/${path}`,
    };

    const headObjectCommand = new HeadObjectCommand(bucketParams);
    const headObject = await this.storage.send(headObjectCommand);

    const getObjectCommand = new GetObjectCommand(bucketParams);

    const options = {
      s3: this.storage,
      command: getObjectCommand,
      maxLength: headObject.ContentLength,
      byteRange: 1024 * 1024,
    };

    return new S3ReadStream(options);
  }

  async download(path: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: `${this.basePath}/${path}`,
    });

    this.logger.verbose(`S3 Read: ${JSON.stringify(command)}`);

    try {
      const { Body } = await this.storage.send(command);
      return Buffer.from(await Body.transformToString('base64'), 'base64');
    } catch (e) {
      throw e;
    }
  }
}
