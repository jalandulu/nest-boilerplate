import { Global, Module } from '@nestjs/common';
import { BullModule } from './bull/bull.module';

@Global()
@Module({
  imports: [BullModule],
  exports: [BullModule],
})
export class QueueServiceModule {}
