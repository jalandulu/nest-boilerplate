import { ICreateIdentityDto } from 'src/cores/interfaces/dtos';

export class SetIdentityUsernameDto implements Pick<ICreateIdentityDto, 'username'> {
  username: string;

  constructor(payload: Pick<ICreateIdentityDto, 'username'>) {
    this.username = payload.username;
  }
}
