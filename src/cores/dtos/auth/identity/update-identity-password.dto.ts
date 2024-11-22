import { Hash } from 'src/common/helpers';
import { IUpdateIdentityPasswordDto } from 'src/cores/interfaces/dtos';

export class UpdateIdentityPasswordDto implements IUpdateIdentityPasswordDto {
  currentPassword: string;
  password: string;

  constructor(payload: IUpdateIdentityPasswordDto) {
    Object.assign(this, payload);
  }

  get hashPassword(): Promise<string> {
    return Hash.make(this.password);
  }
}
