import { ICreateFileDto, IUpdateFileDto } from 'src/cores/interfaces/dtos';

export class UpdateFileDto implements IUpdateFileDto {
  fileType: string;
  originalName: string;
  name: string;
  path: string;
  ext: string;
  size: number;
  attributes?: { [key: string]: any };

  constructor(payload: ICreateFileDto) {
    Object.assign(this, payload);
  }
}
