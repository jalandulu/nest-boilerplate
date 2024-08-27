import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Prisma } from '@prisma/client';
import { ICreateUserDto, IUpdateUserDto } from 'src/cores/dtos';

@Injectable()
export class UserService {
  constructor(
    private readonly dataService: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async findAll() {
    return await this.dataService.tx.user.findMany({
      include: {
        picture: true,
      },
    });
  }

  async findOne<T>(id: string, include?: Prisma.UserInclude) {
    return (await this.dataService.tx.user.findFirst({
      where: { id, deletedAt: null },
      include,
    })) as T;
  }

  async create<T>(createUserDto: ICreateUserDto, include?: Prisma.UserInclude) {
    return (await this.dataService.tx.user.create({
      data: {
        type: createUserDto.type,
        name: createUserDto.name,
        email: createUserDto?.email,
        pictureId: createUserDto.pictureId,
      },
      include,
    })) as T;
  }

  async update<T>(
    id: string,
    updateUserDto: IUpdateUserDto,
    include?: Prisma.UserInclude,
  ) {
    return (await this.dataService.tx.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        pictureId: updateUserDto.pictureId,
      },
      include,
    })) as T;
  }

  async remove(id: string) {
    return await this.dataService.tx.user.update({
      where: { id },
      data: {
        deletedAt: DateTime.now().toISO(),
        identity: {
          update: {
            deletedAt: DateTime.now().toISO(),
          },
        },
      },
    });
  }

  async removeForce(id: string) {
    await this.dataService.tx.permissionsOnIdentities.deleteMany({
      where: { identityId: id },
    });
    await this.dataService.tx.identity.delete({
      where: { id },
    });

    return await this.dataService.tx.user.delete({
      where: { id },
    });
  }
}
