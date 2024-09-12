import {
  HttpException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthService, IdentityService } from 'src/services';
import { FastifyRequest } from 'fastify';
import {
  ResetPasswordResetRequest,
  ResetPasswordRequestRequest,
  SignedVerifyRequest,
} from '../requests';
import { SignatureError } from 'signed';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly identityService: IdentityService,
  ) {}

  async request(request: FastifyRequest, payload: ResetPasswordRequestRequest) {
    const origin = request.headers.origin;
    if (!origin) {
      throw new UnprocessableEntityException('undefined origin hostname');
    }

    const identity = await this.identityService.findUsername(payload.email);
    if (!identity) {
      throw new NotFoundException(`email or username does not found`);
    }

    const signatureUrl = await this.authService.resetPasswordStrategy(
      `${origin}/reset-password/reset`,
      identity.id,
    );

    return { url: signatureUrl, identity };
  }

  async reset(
    request: FastifyRequest,
    query: SignedVerifyRequest,
    payload: ResetPasswordResetRequest,
  ) {
    try {
      const origin = request.headers.origin;
      if (!origin) {
        throw new UnprocessableEntityException('undefined origin hostname');
      }

      const signatureUrl = new URL(`${origin}/reset-password/reset`);
      signatureUrl.searchParams.append('signed', query.signed);
      signatureUrl.searchParams.append('token', query.token);

      const { data } = this.authService.verifySignedUrl(signatureUrl.href);

      const isValidToken = await this.authService.resetPasswordToken(data);
      if (!isValidToken) {
        throw new UnprocessableEntityException('Request expired');
      }

      const [identity] = await Promise.all([
        this.identityService.updatePassword(data, {
          password: payload.password,
        }),
        this.authService.passwordResetted(data),
      ]);

      return identity;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof SignatureError) {
        throw new UnprocessableEntityException(error.message);
      }
    }
  }
}
