import { IPaginationDto } from '../interfaces/dtos';

export class PaginationDto implements IPaginationDto {
  page?: number;
  perPage?: number;

  constructor(payload: IPaginationDto) {
    this.page = payload.page;
    this.perPage = payload.perPage;
  }
}
