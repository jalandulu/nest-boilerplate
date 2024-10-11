import { IUpdateIdentityCredentialDto } from 'src/cores/interfaces/dtos';

export class UpdateIdentityCredentialDto
  implements IUpdateIdentityCredentialDto
{
  username?: string;
  password?: string;
}
