import { Global, Module } from '@nestjs/common';
import { IsExistsValidator } from './is-exists.validator';
import { IsUniqueValidator } from './is-unique.validator';
import { IsMatchValidator } from './is-match.validator';
import { IsQueryableColumnValidator } from './is-queryable-column.validator';

@Global()
@Module({
  providers: [IsExistsValidator, IsUniqueValidator, IsMatchValidator, IsQueryableColumnValidator],
  exports: [IsExistsValidator, IsUniqueValidator, IsMatchValidator, IsQueryableColumnValidator],
})
export class ValidatorModule {}
