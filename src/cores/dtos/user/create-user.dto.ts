export interface ICreateUserDto {
  type: string;
  name: string;
  email?: string;
  pictureId?: number;
}
