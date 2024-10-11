export interface ICreateDirectoryDto {
  parentId?: number;
  name: string;
  path: string;
  totalFiles?: number;
  totalSize?: number;
  starred?: boolean;
  editable?: boolean;
  removable?: boolean;
  description?: string;
}
