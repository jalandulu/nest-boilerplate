import { Injectable } from '@nestjs/common';
import { Generate } from 'src/common/helpers';
import { IStorageServiceProvider } from 'src/cores/contracts';
import { IStorageUploadEntity } from 'src/cores/entities';
import { IStorageRepository, IStorageSignedOption } from 'src/cores/interfaces';
import * as mime from 'mime-types';

@Injectable()
export class StorageRepository implements IStorageRepository {
  constructor(private readonly S3Service: IStorageServiceProvider) {}

  publicUrl(path: string): string {
    return this.S3Service.publicUrl(path);
  }

  async signedUrl({
    path,
    options,
  }: {
    path: string;
    options?: IStorageSignedOption;
  }): Promise<string> {
    return this.S3Service.signedUrl(path, options);
  }

  async readStream({ path }: { path: string }) {
    return await this.S3Service.readStream(path);
  }

  async upload({
    path,
    file,
  }: {
    path: string;
    file: S3.MultipartFile;
  }): Promise<IStorageUploadEntity> {
    const name = Generate.fileName(file.mimetype);
    const fullPath = `${path}/${name}`;
    const uploaded = await this.S3Service.upload(fullPath, file);

    return {
      name,
      originalName: file.filename,
      path: fullPath,
      basePath: uploaded.basePath,
      fullPath: uploaded.fullPath,
      ext: mime.extension(file.mimetype),
      size: file.size,
      stored: uploaded.stored,
    };
  }

  async download({ path }: { path: string }): Promise<Buffer> {
    return this.S3Service.download(path);
  }
}
