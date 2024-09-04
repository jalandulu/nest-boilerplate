import { Injectable } from '@nestjs/common';
import { FileService } from './file.service';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { DateTime } from 'luxon';
import { DirectoryService } from './directory.service';
import { IStorageRepository } from 'src/cores/interfaces';
import { StorageCode } from 'src/cores/enums';
import { Storage } from 'src/common/helpers';
import { ICreateFileDirectoryDto } from 'src/cores/dtos/storage';
import { Prisma } from '@prisma/client';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class FileDirectoryService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
    private readonly fileService: FileService,
    private readonly directoryService: DirectoryService,
    private readonly storageRepository: IStorageRepository,
  ) {}

  async findAll() {
    return await this.dataService.tx.stgFileDirectory.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async findOne(code: StorageCode, fileId: number) {
    const dirPath = Storage.path(code);

    return await this.dataService.tx.stgFileDirectory.findFirst({
      where: { dirPath, fileId },
    });
  }

  async create(createFileDirectory: ICreateFileDirectoryDto) {
    return await this.dataService.tx.stgFileDirectory.create({
      data: {
        directoryId: createFileDirectory.directoryId,
        fileId: createFileDirectory.fileId,
        dirName: createFileDirectory.dirName,
        dirPath: createFileDirectory.dirPath,
        fileOriginalName: createFileDirectory.fileOriginalName,
        fileName: createFileDirectory.fileName,
        filePath: createFileDirectory.filePath,
        ext: createFileDirectory.ext,
        size: createFileDirectory.size,
        attributes: createFileDirectory.attributes,
        starred: createFileDirectory.starred,
        editable: createFileDirectory.editable,
        removable: createFileDirectory.removable,
      },
    });
  }

  async upload({
    fileId,
    directory,
  }: {
    fileId: number;
    directory: {
      id: number;
      name: string;
      path: string;
      totalSize: number;
      totalFiles: number;
    };
  }) {
    const file = await this.fileService.findOne(fileId);

    await this.directoryService.updateUsage(directory.id, {
      totalFiles: directory.totalFiles + 1,
      totalSize: directory.totalSize + file.size,
    });

    return await this.create({
      directoryId: directory.id,
      fileId: fileId,
      dirName: directory.name,
      dirPath: directory.path,
      fileOriginalName: file.originalName,
      fileName: file.name,
      filePath: file.path,
      ext: file.ext,
      size: file.size,
    });
  }

  async save({
    dirname,
    fileId,
  }: {
    fileId: number;
    dirname: Storage.DirpathType | string;
  }) {
    const directory = await this.directoryService.findOne<
      Prisma.StgDirectoryGetPayload<Prisma.StgDirectoryDefaultArgs>
    >(Storage.dirpath(dirname));

    return await this.upload({
      fileId: fileId,
      directory: {
        id: directory.id,
        name: directory.name,
        path: directory.path,
        totalSize: directory.totalSize.toNumber(),
        totalFiles: directory.totalFiles,
      },
    });
  }

  async signedUrl({ path }: { path: string }) {
    return await this.storageRepository.signedUrl({ path });
  }

  async remove(id: number) {
    return await this.dataService.tx.stgFileDirectory.update({
      where: {
        id,
      },
      data: {
        deletedAt: DateTime.now().toISO(),
      },
    });
  }

  async removeForce(id: number) {
    return await this.dataService.tx.stgFileDirectory.delete({
      where: {
        id,
      },
    });
  }

  async removeMany(ids: number[]) {
    return await this.dataService.tx.stgFileDirectory.softDeleteMany({
      id: {
        in: ids,
      },
    });
  }

  async removeForceMany(ids: number[]) {
    return await this.dataService.tx.stgFileDirectory.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
