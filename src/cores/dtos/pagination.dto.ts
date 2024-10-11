import { IPaginationDto } from '../interfaces/dtos';

export class PaginationDto implements IPaginationDto {
  page?: number;
  perPage?: number;
}
