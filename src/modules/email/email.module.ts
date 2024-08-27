import { Module } from '@nestjs/common';
import { EmailController } from './controllers';
import { JwtService } from 'src/services';
import { AuthService } from 'src/services';
import { JwtStrategy } from 'src/middlewares/strategies';
import { IJwtRepository } from 'src/cores/interfaces';
import { JwtRepository } from 'src/infrastructures/repositories';
import { IMailerServiceProvider } from 'src/cores/contracts';
import { NodemailerService } from 'src/infrastructures/mailer';
import { BullModule } from 'src/infrastructures/queue';

@Module({
  imports: [BullModule],
  controllers: [EmailController],
  providers: [
    JwtStrategy,
    JwtService,
    AuthService,
    { provide: IJwtRepository, useClass: JwtRepository },
    { provide: IMailerServiceProvider, useClass: NodemailerService },
  ],
})
export class EmailModule {}
