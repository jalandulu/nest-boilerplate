import { ICreateUserDto } from 'src/cores/interfaces/dtos';

export class CreateUserDto implements ICreateUserDto {
  type: string;
  name: string;
  email?: string;
  pictureId?: number;

  constructor(payload: ICreateUserDto) {
    this.type = payload.type;
    this.name = payload.name;
    this.email = payload.email;
    this.pictureId = payload.pictureId;
  }
}
