import { IUpdateUserDto } from 'src/cores/interfaces/dtos';

export class UpdateUserDto implements IUpdateUserDto {
  name?: string;
  email?: string;
  pictureId?: number;

  constructor(payload: IUpdateUserDto) {
    Object.assign(this, payload);
  }
}
