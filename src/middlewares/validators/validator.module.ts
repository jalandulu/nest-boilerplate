import { Global, Module } from '@nestjs/common';
import { IsExistsValidator } from './is-exists.validator';
import { IsUniqueValidator } from './is-unique.validator';

@Global()
@Module({
  providers: [IsExistsValidator, IsUniqueValidator],
  exports: [IsExistsValidator, IsUniqueValidator],
})
export class ValidatorModule {}
