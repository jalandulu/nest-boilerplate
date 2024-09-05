import { S3ReadStream } from 's3-readstream/dist/S3Readstream';
import { IStorageUploadEntity } from 'src/cores/entities';
import { S3 } from 'src/infrastructures/storage/globals';

export abstract class IStorageRepository {
  abstract signedUrl({ path }: { path: string }): Promise<string>;

  abstract readStream({ path }: { path: string }): Promise<S3ReadStream>;

  abstract upload({
    path,
    file,
  }: {
    path: string;
    file: S3.MultipartFile;
  }): Promise<IStorageUploadEntity>;

  abstract download({ path }: { path: string }): Promise<Buffer>;
}
