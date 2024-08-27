import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategy } from 'src/cores/enums';

@Injectable()
export class LocalAuthGuard extends AuthGuard(AuthStrategy.Local) {}
