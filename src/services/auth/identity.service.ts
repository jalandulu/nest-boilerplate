import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DateTime } from 'luxon';
import { Hash } from 'src/common/helpers';
import {
  ICreateIdentityDto,
  IPaginationDto,
  IUpdateIdentityCredentialDto,
  IUpdateIdentityDto,
  IUpdateIdentityProfileDto,
} from 'src/cores/dtos';
import { AccountStatus } from 'src/cores/enums';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class IdentityService {
  constructor(
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async findAll({
    page,
    perPage,
    currentUserId,
  }: {
    q?: string;
    currentUserId?: string;
  } & IPaginationDto) {
    return await this.dataService.tx.identity
      .paginate({
        where: {
          id: {
            not: currentUserId,
          },
          roleId: {
            not: 1,
          },
          deletedAt: null,
        },
        include: {
          user: {
            include: {
              picture: true,
            },
          },
          role: true,
        },
      })
      .withPages({
        limit: perPage,
        page: page,
      });
  }

  async findOne<T>(id: string, include?: Prisma.IdentityInclude) {
    return (await this.dataService.tx.identity.findFirst({
      where: { id, deletedAt: null },
      include: include,
    })) as T;
  }

  async findUsername(username: string) {
    return await this.dataService.tx.identity.findFirst({
      where: {
        username,
        deletedAt: null,
      },
    });
  }

  async isVerified(id: string) {
    const isVerified = await this.dataService.tx.identity.findFirst({
      where: {
        id,
        verifiedAt: null,
        deletedAt: null,
      },
      select: {
        verifiedAt: true,
      },
    });

    if (!isVerified) return true;

    return !!isVerified.verifiedAt;
  }

  async isActive(id: string) {
    const isVerified = await this.dataService.tx.identity.findFirst({
      where: {
        id,
        disabledAt: null,
        deletedAt: null,
      },
      select: {
        disabledAt: true,
      },
    });

    return !!isVerified;
  }

  async create<T>(
    createIdentityDto: ICreateIdentityDto,
    include?: Prisma.IdentityInclude,
  ) {
    return (await this.dataService.tx.identity.create({
      data: {
        id: createIdentityDto.userId,
        roleId: createIdentityDto.roleId,
        username: createIdentityDto.username,
        password: await Hash.make(createIdentityDto.password),
        status: AccountStatus.Active,
        permissionsOnIdentities: {
          create: createIdentityDto.permissionIds.map((id) => ({
            permissionId: id,
          })),
        },
      },
      include,
    })) as T;
  }

  async updateProfile(id: string, profileDto: IUpdateIdentityProfileDto) {
    return await this.dataService.tx.identity.update({
      where: { id },
      data: {
        user: {
          update: {
            data: {
              name: profileDto.name,
            },
          },
        },
      },
    });
  }

  async updateUsername(
    id: string,
    { username }: Pick<IUpdateIdentityDto, 'username'>,
  ) {
    return await this.dataService.tx.identity.update({
      where: { id },
      data: {
        username,
        user: {
          update: {
            data: {
              email: username,
            },
          },
        },
      },
    });
  }

  async updateRole(id: string, { roleId }: Pick<ICreateIdentityDto, 'roleId'>) {
    return await this.dataService.tx.identity.update({
      where: { id },
      data: {
        roleId,
      },
    });
  }

  async updatePermission(
    id: string,
    { permissionIds }: Pick<ICreateIdentityDto, 'permissionIds'>,
  ) {
    await this.dataService.tx.permissionsOnIdentities.deleteMany({
      where: {
        identityId: id,
      },
    });

    return await this.dataService.tx.identity.update({
      where: { id },
      data: {
        permissionsOnIdentities: {
          create: permissionIds.map((id) => ({
            permissionId: id,
          })),
        },
      },
    });
  }

  async changePassword(
    id: string,
    { currentPassword, password }: IUpdateIdentityCredentialDto,
  ) {
    const exist = await this.dataService.tx.identity.findFirst({
      where: {
        id: id,
      },
    });

    if (!exist) {
      throw new NotFoundException(`account doesn't exist`);
    }

    if (!(await Hash.verify(currentPassword, exist.password))) {
      throw new BadRequestException([
        {
          field: 'currentPassword',
          errors: [`current password doesn't match.`],
        },
      ]);
    }

    return await this.updatePassword(id, { password });
  }

  async updatePassword(
    id: string,
    { password }: Omit<IUpdateIdentityDto, 'username'>,
  ) {
    return await this.dataService.tx.identity.update({
      where: { id },
      data: {
        password: await Hash.make(password),
      },
    });
  }

  async updateStatus(id: string, enabled: boolean) {
    return await this.dataService.tx.identity.update({
      where: { id },
      data: {
        status: enabled ? AccountStatus.Active : AccountStatus.Inactive,
        disabledAt: enabled ? null : DateTime.now().toISO(),
      },
    });
  }

  async updateVerified(id: string, verifiedAt?: string) {
    const emailVerifiedAt = verifiedAt || DateTime.now().toISO();

    return await this.dataService.tx.identity.update({
      where: { id },
      data: {
        verifiedAt: emailVerifiedAt,
        user: {
          update: {
            data: {
              emailVerifiedAt: emailVerifiedAt,
            },
          },
        },
      },
    });
  }

  async remove(id: string) {
    return await this.dataService.tx.identity.update({
      where: { id },
      data: {
        disabledAt: DateTime.now().toISO(),
        deletedAt: DateTime.now().toISO(),
      },
    });
  }

  async removeForce(id: string) {
    return await this.dataService.tx.identity.delete({
      where: { id },
    });
  }

  async removePermissions(id: string) {
    return await this.dataService.tx.permissionsOnIdentities.deleteMany({
      where: { identityId: id },
    });
  }
}
