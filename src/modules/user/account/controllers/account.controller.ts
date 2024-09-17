import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessAuthGuard } from 'src/middlewares/guards';
import {
  CreateAccountRequest,
  QueryUserRequest,
  UpdateAccountRequest,
} from '../requests';
import { AccountUseCase } from '../use-cases';
import { AccountMapper } from 'src/middlewares/interceptors';
import { IQueueServiceProvider } from 'src/cores/contracts';
import { QueueMailerProcessor } from 'src/cores/consts';
import { FastifyRequest } from 'fastify';

@ApiTags('Account')
@UseGuards(AccessAuthGuard)
@Controller({
  path: 'accounts',
  version: '1.0',
})
export class AccountController {
  constructor(
    private readonly accountMapper: AccountMapper,
    private readonly accountUseCase: AccountUseCase,
    private readonly queueServiceProvider: IQueueServiceProvider,
  ) {}

  @Get()
  async findAll(@Query() query: QueryUserRequest) {
    const [accounts, meta] = await this.accountUseCase.findAll(query);

    return await this.accountMapper.toPaginate(accounts, meta);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const account = await this.accountUseCase.findOne(id);

    return await this.accountMapper.toMap(account);
  }

  @Post(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(
    @Req() request: FastifyRequest,
    @Param('userId') userId: string,
    @Body() payload: CreateAccountRequest,
  ) {
    const { account, credential } = await this.accountUseCase.create(
      userId,
      payload,
    );

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: credential.username,
      template: 'account-credential',
      context: {
        credential: credential,
        link: request.headers.origin,
      },
    });

    return await this.accountMapper.toMap(account);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id') id: string, @Body() payload: UpdateAccountRequest) {
    return await this.accountUseCase.update(id, payload);
  }

  @Patch(':id/reset')
  @HttpCode(HttpStatus.NO_CONTENT)
  async reset(@Req() request: FastifyRequest, @Param('id') id: string) {
    const account = await this.accountUseCase.reset(id);

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: account.credential.username,
      template: 'account-credential',
      context: {
        credential: account.credential,
        link: request.headers.origin,
      },
    });
  }

  @Patch(':id/disable')
  @HttpCode(HttpStatus.NO_CONTENT)
  async disable(@Param('id') id: string) {
    const account = await this.accountUseCase.disable(id);

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: account.username,
      template: 'account-disable',
    });
  }

  @Patch(':id/enable')
  @HttpCode(HttpStatus.NO_CONTENT)
  async enable(@Param('id') id: string) {
    const account = await this.accountUseCase.enable(id);

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: account.username,
      template: 'account-enable',
    });
  }

  @Delete(':id/destroy')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id') id: string) {
    const account = await this.accountUseCase.destroy(id);

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: account.username,
      template: 'account-destroy',
    });
  }
}
