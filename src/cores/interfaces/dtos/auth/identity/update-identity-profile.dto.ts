import { ICreateUserDto } from '../../user';

export interface IUpdateIdentityProfileDto {
  name?: ICreateUserDto['name'];
  pictureId?: ICreateUserDto['pictureId'];
}
