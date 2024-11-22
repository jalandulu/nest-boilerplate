import { Injectable } from '@nestjs/common';
import { IStorageServiceProvider } from 'src/cores/contracts';
import { FileEntity, FileMap, FilesMap, IPaginationMetaEntity } from 'src/cores/entities';

@Injectable()
export class FilePrivateMapper {
  constructor(private readonly storageProvider: IStorageServiceProvider) {}

  async toMap(file: FileMap): Promise<FileEntity> {
    return {
      id: file.fileId,
      fileDirectoryId: file.id,
      name: file.fileOriginalName,
      extension: file?.ext,
      size: file?.size,
      url: await this.storageProvider.signedUrl(file.filePath),
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    };
  }

  async toCollection(files: FilesMap): Promise<FileEntity[]> {
    return await Promise.all(files.map((file) => this.toMap(file)));
  }

  async toPaginator(data: FileMap[], meta: IPaginationMetaEntity) {
    return {
      data: await this.toCollection(data),
      meta: meta,
    };
  }
}
