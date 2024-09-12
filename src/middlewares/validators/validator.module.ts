import { Global, Module } from '@nestjs/common';
import { IsExistsValidator } from './is-exists.validator';
import { IsUniqueValidator } from './is-unique.validator';
import { IsMatchValidator } from './is-match.validator';

@Global()
@Module({
  providers: [IsExistsValidator, IsUniqueValidator, IsMatchValidator],
  exports: [IsExistsValidator, IsUniqueValidator, IsMatchValidator],
})
export class ValidatorModule {}
