import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  BatchResponse,
  Message,
} from 'firebase-admin/lib/messaging/messaging-api';
import { DateTime } from 'luxon';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { INotificationServiceProvider } from 'src/cores/contracts';
import { ITokenMessage } from 'src/cores/interfaces';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class FirebaseService implements INotificationServiceProvider {
  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {}

  async send(options: ITokenMessage, dryRun?: boolean): Promise<string> {
    try {
      const { token, type, ...message } = options;

      const notificationToken =
        await this.dataService.tx.notificationToken.findFirstOrThrow({
          where: { token },
          include: {
            user: true,
          },
        });

      const [messaging] = await Promise.all([
        this.firebase.messaging.send(options, dryRun),
        this.dataService.tx.notification.create({
          data: {
            service: 'firebase',
            type: type,
            notifiableType: 'users',
            notifiableId: notificationToken.user.id,
            data: message,
            sentAt: DateTime.now().toISO(),
          },
        }),
      ]);

      return messaging;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw error;
        }
      }

      throw new Error(error);
    }
  }

  async sendEach(
    options: ITokenMessage[],
    dryRun?: boolean,
  ): Promise<BatchResponse> {
    const response = await this.firebase.messaging.sendEach(options, dryRun);

    const notifiables = await this.dataService.tx.notificationToken.findMany({
      where: {
        token: {
          in: options.map(({ token }) => token),
        },
      },
      select: {
        token: true,
        user: true,
      },
    });

    await this.dataService.tx.notification.createMany({
      data: options.map(({ token, type, ...message }) => ({
        service: 'firebase',
        type: type,
        notifiableType: 'users',
        notifiableId: notifiables.find((n) => n.token === token).user.id,
        data: message,
        sentAt: DateTime.now().toISO(),
      })),
    });

    return response;
  }
}
