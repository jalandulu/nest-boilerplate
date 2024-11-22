import { IUpdateUsageDirectoryDto } from 'src/cores/interfaces/dtos';

export class UpdateUsageDirectoryDto implements IUpdateUsageDirectoryDto {
  totalSize: number;
  totalFiles: number;

  constructor(payload: IUpdateUsageDirectoryDto) {
    Object.assign(this, payload);
  }
}
