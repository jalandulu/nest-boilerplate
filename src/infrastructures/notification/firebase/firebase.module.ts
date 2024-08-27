import { Global, Module } from '@nestjs/common';
import { FirebaseModule as NestFirebaseModule } from 'nestjs-firebase';
import { FirebaseService } from './firebase.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseConfigService } from './firebase.config';
import { INotificationServiceProvider } from 'src/cores/contracts';

@Global()
@Module({
  imports: [
    NestFirebaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: FirebaseConfigService,
    }),
  ],
  providers: [
    {
      provide: INotificationServiceProvider,
      useClass: FirebaseService,
    },
  ],
  exports: [INotificationServiceProvider],
})
export class FirebaseModule {}
