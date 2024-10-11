import { IUpdateIdentityPasswordDto } from 'src/cores/interfaces/dtos';

export class UpdateIdentityPasswordDto implements IUpdateIdentityPasswordDto {
  currentPassword: string;
  password: string;
}
