import { Module } from '@nestjs/common';
import { StorageController } from './controllers/storage.controller';
import {
  DirectoryService,
  FileDirectoryService,
  FileService,
  StorageService,
} from 'src/services/storage';
import { IStorageRepository } from 'src/cores/interfaces';
import { StorageRepository } from 'src/infrastructures/repositories';
import { UploadUseCase } from './use-cases';

@Module({
  controllers: [StorageController],
  providers: [
    StorageService,
    FileDirectoryService,
    FileService,
    DirectoryService,
    UploadUseCase,
    { provide: IStorageRepository, useClass: StorageRepository },
  ],
})
export class StorageModule {}
