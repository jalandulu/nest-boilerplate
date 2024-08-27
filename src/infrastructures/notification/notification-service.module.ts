import { Global, Module } from '@nestjs/common';
import { FirebaseModule } from './firebase/firebase.module';

@Global()
@Module({
  imports: [FirebaseModule],
  exports: [FirebaseModule],
})
export class NotificationServiceModule {}
