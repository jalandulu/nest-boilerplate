import { IUpdateFileDirectoryDto } from 'src/cores/interfaces/dtos';

export class UpdateFileDirectoryDto implements IUpdateFileDirectoryDto {
  directoryId?: number;
  fileId?: number;
  dirName?: string;
  dirPath?: string;
  fileOriginalName?: string;
  fileName?: string;
  filePath?: string;
  ext: string;
  size: number;
  attributes?: { [key: string]: any };
  starred?: boolean;
  editable?: boolean;
  removable?: boolean;

  constructor(payload: IUpdateFileDirectoryDto) {
    this.directoryId = payload.directoryId;
    this.fileId = payload.fileId;
    this.dirName = payload.dirName;
    this.dirPath = payload.dirPath;
    this.fileOriginalName = payload.fileOriginalName;
    this.fileName = payload.fileName;
    this.filePath = payload.filePath;
    this.ext = payload.ext;
    this.size = payload.size;
    this.attributes = payload.attributes;
    this.starred = payload.starred;
    this.editable = payload.editable;
    this.removable = payload.removable;
  }
}
