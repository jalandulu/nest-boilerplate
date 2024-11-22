import { QueryArgMode } from 'src/cores/consts';

export interface IQueryWhereRequest {
  column: string;
  operator: string;
  mode: keyof typeof QueryArgMode;
  value: string | string[];
}
