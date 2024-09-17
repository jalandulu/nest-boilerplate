import { Module } from '@nestjs/common';
import { AccountController } from './controllers';
import { AccountUseCase } from './use-cases';

@Module({
  controllers: [AccountController],
  providers: [AccountUseCase],
})
export class AccountModule {}
