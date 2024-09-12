import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsMatch } from 'src/middlewares/validators';

export class ResetPasswordResetRequest {
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsMatch('password', {
    message: 'Password confirmation does not match password',
  })
  @ApiProperty()
  passwordConfirmation: string;
}
