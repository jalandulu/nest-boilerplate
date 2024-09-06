import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsExists } from 'src/middlewares/validators';

export class SendNotificationRequest {
  @ApiProperty({
    description: 'The notification token',
    type: String,
  })
  @IsString()
  @IsExists('NotificationToken', 'token')
  public token!: string;

  @ApiProperty({
    type: Object,
    description: 'The notification data',
  })
  public data: { [key: string]: any };
}
