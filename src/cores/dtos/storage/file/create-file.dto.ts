import { ICreateFileDto } from 'src/cores/interfaces/dtos';

export class CreateFileDto implements ICreateFileDto {
  fileType: string;
  originalName: string;
  name: string;
  path: string;
  ext: string;
  size: number;
  attributes?: { [key: string]: any };
}
