import { ICreateUserDto } from 'src/cores/interfaces/dtos';

export class CreateUserDto implements ICreateUserDto {
  type: string;
  name: string;
  email?: string;
  pictureId?: number;
}
