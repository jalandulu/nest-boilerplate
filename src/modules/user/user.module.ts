import { Module } from '@nestjs/common';
import { ProfileModule } from './profile';
import { UserModule as UserResourceModule } from './user';

@Module({
  imports: [ProfileModule, UserResourceModule],
})
export class UserModule {}
