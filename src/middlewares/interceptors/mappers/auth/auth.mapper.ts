import { Injectable } from '@nestjs/common';
import { AuthEntity } from 'src/cores/entities';

@Injectable()
export class AuthMapper {
  toMap(auth: AuthEntity): { data: AuthEntity } {
    return {
      data: auth,
    };
  }
}
