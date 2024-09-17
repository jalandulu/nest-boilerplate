import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { IsExists } from 'src/middlewares/validators';

export class CreateAccountRequest {
  @IsNotEmpty()
  @IsNumber()
  @IsExists('Role', 'id')
  @ApiProperty()
  roleId: number;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({ allowNaN: false }, { each: true })
  @IsExists('Permission', 'id', { each: true })
  @ApiProperty()
  permissionIds: number[];
}
