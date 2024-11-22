import { Module } from '@nestjs/common';
import { StrategyModule } from './strategies';
import { ValidatorModule } from './validators';
import { MapperModule } from './interceptors';
import { PipeModule } from './pipes';

@Module({
  imports: [PipeModule, ValidatorModule, StrategyModule, MapperModule],
  exports: [PipeModule, ValidatorModule, StrategyModule, MapperModule],
})
export class MiddlewareModule {}
