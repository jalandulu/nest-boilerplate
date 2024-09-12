import { Global, Module } from '@nestjs/common';
import {
  AccessStrategy,
  LocalStrategy,
  RefreshStrategy,
} from 'src/middlewares/strategies';
import { AuthMapper } from 'src/modules/auth/mappers/auth.mapper';
import { FileMapper } from 'src/modules/storage/mappers';

@Global()
@Module({
  providers: [
    AuthMapper,
    FileMapper,
    LocalStrategy,
    AccessStrategy,
    RefreshStrategy,
  ],
  exports: [LocalStrategy, AccessStrategy, RefreshStrategy],
})
export class StrategyModule {}
