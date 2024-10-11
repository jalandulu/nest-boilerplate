import { ICreateIdentityDto } from './create-identity.dto';

export interface IUpdateIdentityDto
  extends Partial<Omit<ICreateIdentityDto, 'userId'>> {}
