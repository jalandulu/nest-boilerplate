import { Injectable } from '@nestjs/common';
import { NotificationTokenEntity } from 'src/cores/entities';

@Injectable()
export class NotificationTokenMapper {
  toMap(token: NotificationTokenEntity): NotificationTokenEntity {
    return {
      type: token.type,
      token: token.token,
    };
  }

  toCollection(tokens: NotificationTokenEntity[]): NotificationTokenEntity[] {
    return tokens.map((i) => this.toMap(i));
  }
}
