import { Global, Module } from '@nestjs/common';
import {
  AccessStrategy,
  LocalStrategy,
  RefreshStrategy,
} from 'src/middlewares/strategies';

@Global()
@Module({
  providers: [LocalStrategy, AccessStrategy, RefreshStrategy],
  exports: [LocalStrategy, AccessStrategy, RefreshStrategy],
})
export class StrategyModule {}
