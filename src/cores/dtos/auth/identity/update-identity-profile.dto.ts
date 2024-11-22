import { IUpdateIdentityProfileDto } from 'src/cores/interfaces/dtos';

export class UpdateIdentityProfileDto implements IUpdateIdentityProfileDto {
  name?: string;
  pictureId?: number;

  constructor(payload: IUpdateIdentityProfileDto) {
    Object.assign(this, payload);
  }
}
