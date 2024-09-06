import { Module } from '@nestjs/common';
import { StrategyModule } from './strategies';
import { ValidatorModule } from './validators';

@Module({
  imports: [ValidatorModule, StrategyModule],
  exports: [ValidatorModule, StrategyModule],
})
export class MiddlewareModule {}
