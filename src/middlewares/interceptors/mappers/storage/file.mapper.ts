import { Injectable } from '@nestjs/common';
import { IStorageServiceProvider } from 'src/cores/contracts';
import {
  FileEntity,
  FileMap,
  FilesMap,
  IPaginationMetaEntity,
} from 'src/cores/entities';

@Injectable()
export class FileMapper {
  constructor(private readonly storageProvider: IStorageServiceProvider) {}

  async toMap(file: FileMap): Promise<{ data: FileEntity }> {
    return {
      data: {
        id: file.fileId,
        fileDirectoryId: file.id,
        name: file.fileOriginalName,
        extension: file?.ext,
        size: file?.size,
        url: await this.storageProvider.signedUrl(file.filePath),
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
      },
    };
  }

  async toCollection(files: FilesMap) {
    const mapped = await Promise.all(files.map((file) => this.toMap(file)));

    return {
      data: mapped.map((file) => file.data),
    };
  }

  async toPaginator(data: FileMap[], meta: IPaginationMetaEntity) {
    const mapped = await Promise.all(data.map((file) => this.toMap(file)));

    return {
      data: mapped.map((file) => file.data),
      meta: meta,
    };
  }
}
