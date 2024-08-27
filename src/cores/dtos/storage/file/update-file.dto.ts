import { ICreateFileDto } from './create-file.dto';

export interface IUpdateFileDto {
  fileType: ICreateFileDto['fileType'];
  originalName: ICreateFileDto['originalName'];
  name: ICreateFileDto['name'];
  path: ICreateFileDto['path'];
  ext: ICreateFileDto['ext'];
  size: ICreateFileDto['size'];
  attributes?: ICreateFileDto['attributes'];
}
