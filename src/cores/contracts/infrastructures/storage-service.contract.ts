import { S3ReadStream } from 's3-readstream/dist/S3Readstream';
import { IStorageSignedOption, IStorageUpload } from 'src/cores/interfaces';

export abstract class IStorageServiceProvider {
  abstract upload(
    path: string,
    file: { buffer: Buffer; mimetype: string },
  ): Promise<IStorageUpload>;

  abstract download(path: string): Promise<Buffer>;

  abstract publicUrl(path: string): string;

  abstract signedUrl(path: string, options?: IStorageSignedOption): Promise<string>;

  abstract readStream(path: string): Promise<S3ReadStream>;
}
