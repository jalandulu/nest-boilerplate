import { Global, Module } from '@nestjs/common';
import { BullModule } from './bull/bull.module';
import { IQueueServiceProvider } from 'src/cores/contracts';
import { BullQueueService } from './bull';

@Global()
@Module({
  imports: [BullModule],
  providers: [{ provide: IQueueServiceProvider, useClass: BullQueueService }],
  exports: [
    BullModule,
    { provide: IQueueServiceProvider, useClass: BullQueueService },
  ],
})
export class QueueServiceModule {}
