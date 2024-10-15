import { IUpdateIdentityProfileDto } from 'src/cores/interfaces/dtos';

export class UpdateIdentityProfileDto implements IUpdateIdentityProfileDto {
  name?: string;
  pictureId?: number;

  constructor(payload: IUpdateIdentityProfileDto) {
    this.name = payload.name;
    this.pictureId = payload.pictureId;
  }
}
