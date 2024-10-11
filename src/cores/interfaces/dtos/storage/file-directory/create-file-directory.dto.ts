export interface ICreateFileDirectoryDto {
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
}
