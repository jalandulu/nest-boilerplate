import { ICreateDirectoryDto } from 'src/cores/interfaces/dtos';

export class CreateDirectoryDto implements ICreateDirectoryDto {
  parentId?: number;
  name: string;
  path: string;
  totalFiles?: number;
  totalSize?: number;
  starred?: boolean;
  editable?: boolean;
  removable?: boolean;
  description?: string;

  constructor(payload: ICreateDirectoryDto) {
    this.parentId = payload.parentId;
    this.name = payload.name;
    this.path = payload.path;
    this.totalFiles = payload.totalFiles;
    this.totalSize = payload.totalSize;
    this.starred = payload.starred;
    this.editable = payload.editable;
    this.removable = payload.removable;
    this.description = payload.description;
  }
}
