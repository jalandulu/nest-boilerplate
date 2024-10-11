import { IUpdateDirectoryDto } from 'src/cores/interfaces/dtos';

export class UpdateDirectoryDto implements IUpdateDirectoryDto {
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
