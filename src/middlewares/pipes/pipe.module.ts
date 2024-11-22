import { Module } from '@nestjs/common';
import { ValidationPipe } from './validation.pipe';
import { ExistedIdValidationPipe } from './existed-id-validation.pipe';

@Module({
  providers: [ValidationPipe, ExistedIdValidationPipe],
  exports: [ValidationPipe, ExistedIdValidationPipe],
})
export class PipeModule {}
