import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsExists, IsUnique } from 'src/middlewares/validators';

export class RegisterRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: 'New User' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @IsUnique('user', 'email')
  @ApiProperty({ default: 'register@nest.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsOptional()
  @IsExists('stgFile', 'id')
  @ApiProperty()
  pictureId: number;
}
