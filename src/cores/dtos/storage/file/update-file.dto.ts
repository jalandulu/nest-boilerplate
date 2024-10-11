import { ICreateFileDto, IUpdateFileDto } from 'src/cores/interfaces/dtos';

export class UpdateFileDto implements IUpdateFileDto {
  fileType: ICreateFileDto['fileType'];
  originalName: ICreateFileDto['originalName'];
  name: ICreateFileDto['name'];
  path: ICreateFileDto['path'];
  ext: ICreateFileDto['ext'];
  size: ICreateFileDto['size'];
  attributes?: ICreateFileDto['attributes'];
}
