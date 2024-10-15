import { Hash } from 'src/common/helpers';
import { IUpdateIdentityPasswordDto } from 'src/cores/interfaces/dtos';

export class SetIdentityPasswordDto
  implements Omit<IUpdateIdentityPasswordDto, 'currentPassword'>
{
  password: string;

  constructor(payload: Omit<IUpdateIdentityPasswordDto, 'currentPassword'>) {
    this.password = payload.password;
  }

  get hashPassword(): Promise<string> {
    return Hash.make(this.password);
  }
}
