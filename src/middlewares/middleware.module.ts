import { Module } from '@nestjs/common';
import { StrategyModule } from './strategies';
import { ValidatorModule } from './validators';
import { MapperModule } from './interceptors';

@Module({
  imports: [ValidatorModule, StrategyModule, MapperModule],
  exports: [ValidatorModule, StrategyModule, MapperModule],
})
export class MiddlewareModule {}
