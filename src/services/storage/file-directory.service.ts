import { Injectable } from '@nestjs/common';
import { FileService } from './file.service';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { DateTime } from 'luxon';
import { DirectoryService } from './directory.service';
import { IStorageRepository, IStorageSignedOption } from 'src/cores/interfaces';
import { StorageCode } from 'src/cores/enums';
import { Storage } from 'src/common/helpers';
import { CreateFileDirectoryDto } from 'src/cores/dtos';
import { Prisma } from '@prisma/client';
import { ExtendedPrismaClient } from 'src/infrastructures/database';

@Injectable()
export class FileDirectoryService {
  constructor(
    private readonly dataService: TransactionHost<TransactionalAdapterPrisma<ExtendedPrismaClient>>,
    private readonly fileService: FileService,
    private readonly directoryService: DirectoryService,
    private readonly storageRepository: IStorageRepository,
  ) {}

  async findAll() {
    return await this.dataService.tx.stgFileOnDirectory.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async findOne(code: StorageCode, fileId: number) {
    const dirPath = Storage.path(code);

    return await this.dataService.tx.stgFileOnDirectory.findFirst({
      where: { dirPath, fileId },
    });
  }

  async create(createFileDirectory: CreateFileDirectoryDto) {
    return await this.dataService.tx.stgFileOnDirectory.create({
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

    const [created] = await Promise.all([
      this.create({
        directoryId: directory.id,
        fileId: fileId,
        dirName: directory.name,
        dirPath: directory.path,
        fileOriginalName: file.originalName,
        fileName: file.name,
        filePath: file.path,
        ext: file.ext,
        size: file.size,
      }),
      this.fileService.uploaded(fileId),
      this.directoryService.updateUsage(directory.id, {
        totalFiles: directory.totalFiles + 1,
        totalSize: directory.totalSize + file.size,
      }),
    ]);

    return created;
  }

  async save({
    dirname,
    fileId,
  }: {
    dirname: Storage.DirnameType | Storage.DirpathType;
    fileId: number;
  }) {
    const directory = await this.directoryService.findOne(Storage.dirpath(dirname));

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

  async saveMany({
    dirname,
    fileIds,
  }: {
    dirname: Storage.DirnameType | Storage.DirpathType;
    fileIds: number[];
  }) {
    const directory = await this.directoryService.findOne(Storage.dirpath(dirname));

    return await Promise.all(
      fileIds.map((fileId) =>
        this.upload({
          fileId: fileId,
          directory: {
            id: directory.id,
            name: directory.name,
            path: directory.path,
            totalSize: directory.totalSize.toNumber(),
            totalFiles: directory.totalFiles,
          },
        }),
      ),
    );
  }

  async signedUrl({ path, options }: { path: string; options?: IStorageSignedOption }) {
    return await this.storageRepository.signedUrl({ path, options });
  }

  async remove(id: number) {
    return await this.dataService.tx.stgFileOnDirectory.update({
      where: {
        id,
      },
      data: {
        deletedAt: DateTime.now().toISO(),
      },
    });
  }

  async removeForce(id: number) {
    return await this.dataService.tx.stgFileOnDirectory.delete({
      where: { id },
    });
  }

  async removeMany(ids: number[]) {
    return await Promise.all(ids.map(this.remove));
  }

  async removeForceMany(ids: number[]) {
    return await Promise.all(ids.map(this.removeForce));
  }

  async removeManyBy(where: Prisma.StgFileOnDirectoryWhereInput) {
    return await this.dataService.tx.stgFileOnDirectory.updateMany({
      where: where,
      data: {
        deletedAt: DateTime.now().toISO(),
      },
    });
  }

  async removeForceManyBy(where: Prisma.StgFileOnDirectoryWhereInput) {
    return await this.dataService.tx.stgFileOnDirectory.deleteMany({
      where: where,
    });
  }
}
