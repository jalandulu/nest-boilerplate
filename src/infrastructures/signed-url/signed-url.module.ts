import { Global, Module } from '@nestjs/common';
import { SignedUrlService } from './signed-url.service';
import { ISignedUrlServiceProvider } from 'src/cores/contracts';

@Global()
@Module({
  providers: [
    {
      provide: ISignedUrlServiceProvider,
      useClass: SignedUrlService,
    },
  ],
  exports: [ISignedUrlServiceProvider],
})
export class SignedUrlModule {}
