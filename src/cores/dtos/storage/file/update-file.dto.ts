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
    this.fileType = payload.fileType;
    this.originalName = payload.originalName;
    this.name = payload.name;
    this.path = payload.path;
    this.ext = payload.ext;
    this.size = payload.size;
    this.attributes = payload.attributes;
  }
}
