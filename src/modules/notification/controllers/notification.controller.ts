import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessAuthGuard } from 'src/middlewares/guards';
import { INotificationServiceProvider } from 'src/cores/contracts';
import {
  QueryNotificationRequest,
  ReadNotificationRequest,
  RemoveNotificationRequest,
  SendNotificationRequest,
} from '../requests';
import { NotificationUseCase, StatisticNotificationUseCase } from '../use-cases';
import { NotificationMapper } from 'src/middlewares/interceptors';
import { NotificationType } from 'src/cores/enums';

@ApiTags('Notification')
@UseGuards(AccessAuthGuard)
@Controller({
  path: 'notification',
  version: '1.0',
})
export class NotificationController {
  constructor(
    private readonly mapper: NotificationMapper,
    private readonly statisticUseCase: StatisticNotificationUseCase,
    private readonly notificationUseCase: NotificationUseCase,
    private readonly notificationProvider: INotificationServiceProvider,
  ) {}

  @Get('statistic')
  async statistic(@Query() request: QueryNotificationRequest) {
    return this.mapper.toStatistic(await this.statisticUseCase.get(request));
  }

  @Get()
  async findAll(@Query() request: QueryNotificationRequest) {
    const [data, meta] = await this.notificationUseCase.findAll(request);
    return this.mapper.toPaginate(data, meta);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async read(@Param('id', ParseIntPipe) id: number) {
    await this.notificationUseCase.read(id);
  }

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  async readMany(@Body() request: ReadNotificationRequest) {
    await this.notificationUseCase.readMany(request);
  }

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async send(@Body() request: SendNotificationRequest) {
    await this.notificationProvider.sendEach([
      {
        type: NotificationType.Unknown,
        token: request.token,
        data: request.data,
      },
    ]);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.notificationUseCase.remove(id);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMany(@Body() request: RemoveNotificationRequest) {
    await this.notificationUseCase.removeMany(request);
  }
}
