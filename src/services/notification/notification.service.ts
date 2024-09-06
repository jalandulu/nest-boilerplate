import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import {
  ICreateNotificationDto,
  INotifiableNotificationDto,
  IPaginationDto,
  IUpdateNotificationDto,
} from 'src/cores/dtos';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class NotificationService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async findAll(pagination: IPaginationDto) {
    return await this.dataService.tx.notification.paginate().withPages({
      limit: pagination.perPage,
      page: pagination.page,
    });
  }

  async findByNotifiable({
    notifiableType,
    notifiableId,
    page,
    perPage,
  }: INotifiableNotificationDto & IPaginationDto) {
    return await this.dataService.tx.notification
      .paginate({
        where: {
          notifiableType,
          notifiableId,
        },
      })
      .withPages({
        limit: perPage,
        page: page,
      });
  }

  async findOne<T>(id: number) {
    return (await this.dataService.tx.notification.findFirst({
      where: { id },
    })) as T;
  }

  async create<T, U>(notifiactionDto: ICreateNotificationDto<U>) {
    return (await this.dataService.tx.notification.create({
      data: {
        service: notifiactionDto.service,
        type: notifiactionDto.type,
        notifiableType: notifiactionDto.notifiableType,
        notifiableId: notifiactionDto.notifiableId,
        data: notifiactionDto.data,
        sentAt: notifiactionDto.sentAt,
        readAt: notifiactionDto.readAt,
      },
    })) as T;
  }

  async createMany<T, U>(notifiactionDto: ICreateNotificationDto<U>[]) {
    return (await this.dataService.tx.notification.createMany({
      data: notifiactionDto.map((n) => ({
        service: n.service,
        type: n.type,
        notifiableType: n.notifiableType,
        notifiableId: n.notifiableId,
        data: n.data,
        sentAt: n.sentAt,
        readAt: n.readAt,
      })),
    })) as T;
  }

  async update<T, U>(id: number, notifiactionDto: IUpdateNotificationDto<U>) {
    return (await this.dataService.tx.notification.update({
      where: { id },
      data: {
        service: notifiactionDto.service,
        type: notifiactionDto.type,
        notifiableType: notifiactionDto.notifiableType,
        notifiableId: notifiactionDto.notifiableId,
        data: notifiactionDto.data,
        sentAt: notifiactionDto.sentAt,
        readAt: notifiactionDto.readAt,
      },
    })) as T;
  }

  async sent(id: number) {
    return await this.dataService.tx.notification.update({
      where: { id },
      data: {
        sentAt: DateTime.now().toISO(),
      },
    });
  }

  async read(id: number) {
    return await this.dataService.tx.notification.update({
      where: { id },
      data: {
        readAt: DateTime.now().toISO(),
      },
    });
  }

  async readByNotifiable({
    notifiableType,
    notifiableId,
  }: INotifiableNotificationDto) {
    return await this.dataService.tx.notification.updateMany({
      where: { notifiableId, notifiableType },
      data: {
        readAt: DateTime.now().toISO(),
      },
    });
  }

  async remove(id: number) {
    return await this.dataService.tx.notification.delete({
      where: { id },
    });
  }

  async removeByNotifiable({
    notifiableType,
    notifiableId,
  }: INotifiableNotificationDto) {
    return await this.dataService.tx.notification.deleteMany({
      where: { notifiableType, notifiableId },
    });
  }
}
