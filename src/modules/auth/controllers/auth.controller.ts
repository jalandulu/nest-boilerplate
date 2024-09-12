import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {
  SignedVerifyRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequestRequest,
  ResetPasswordResetRequest,
} from '../requests';
import { AuthMapper } from '../mappers/auth.mapper';
import {
  EmailVerificationUseCase,
  LoginUseCase,
  RefreshUseCase,
  RegisterUseCase,
  ResetPasswordUseCase,
} from '../use-cases';
import { LogoutUseCase } from '../use-cases/logout.use-case';
import { LocalAuthEntity, ProfileEntity } from 'src/cores/entities';
import {
  AccessAuthGuard,
  LocalAuthGuard,
  RefreshAuthGuard,
} from 'src/middlewares/guards';
import { AuthPayload } from 'src/common/decorators';
import { FastifyRequest } from 'fastify';
import { IQueueServiceProvider } from 'src/cores/contracts';
import { QueueMailerProcessor } from 'src/cores/consts';

@ApiTags('Authentication')
@Controller({
  path: 'auth',
  version: '1.0',
})
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshUseCase: RefreshUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly emailVerificationUseCase: EmailVerificationUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly queueServiceProvider: IQueueServiceProvider,
    private readonly authMapper: AuthMapper,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginRequest })
  async login(
    @Request()
    { user }: { user: LocalAuthEntity },
  ) {
    const { authenticated, abilities } = await this.loginUseCase.login({
      user,
    });

    return this.authMapper.toMap({
      profile: user.user,
      accessToken: authenticated.accessToken,
      refreshToken: authenticated.refreshToken,
      abilities,
    });
  }

  @Post('register')
  async register(
    @Req() request: FastifyRequest,
    @Body() payload: RegisterRequest,
  ) {
    const { user, authenticated, abilities, emailVerificationUrl } =
      await this.registerUseCase.register(request, payload);

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: user.email,
      template: 'email-verification',
      context: {
        link: emailVerificationUrl,
      },
    });

    return this.authMapper.toMap({
      profile: user,
      accessToken: authenticated.accessToken,
      refreshToken: authenticated.refreshToken,
      abilities,
    });
  }

  @Post('verification-email/send')
  @UseGuards(AccessAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendEmailVerification(
    @Req() request: FastifyRequest,
    @AuthPayload() payload: ProfileEntity,
  ) {
    const url = await this.emailVerificationUseCase.sign(
      request,
      payload.profile.id,
    );

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: payload.profile.email,
      template: 'email-verification',
      context: {
        link: url,
      },
    });
  }

  @Post('verification-email/verify')
  @HttpCode(HttpStatus.NO_CONTENT)
  async verifyEmailVerification(
    @Req() request: FastifyRequest,
    @Query() payload: SignedVerifyRequest,
  ) {
    await this.emailVerificationUseCase.verify(request, payload);
  }

  @Post('reset-password/request')
  @HttpCode(HttpStatus.NO_CONTENT)
  async requestResetPassword(
    @Req() request: FastifyRequest,
    @Body() payload: ResetPasswordRequestRequest,
  ) {
    const { url, identity } = await this.resetPasswordUseCase.request(
      request,
      payload,
    );

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: identity.username,
      template: 'reset-password-request',
      context: {
        link: url,
      },
    });
  }

  @Post('reset-password/reset')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(
    @Req() request: FastifyRequest,
    @Query() query: SignedVerifyRequest,
    @Body() payload: ResetPasswordResetRequest,
  ) {
    const identity = await this.resetPasswordUseCase.reset(
      request,
      query,
      payload,
    );

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: identity.username,
      template: 'reset-password-success',
      context: {
        link: request.headers.origin,
      },
    });
  }

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  async refresh(@AuthPayload() payload: ProfileEntity) {
    const { user, authenticated, abilities } =
      await this.refreshUseCase.refresh(payload);

    return this.authMapper.toMap({
      profile: user,
      accessToken: authenticated.accessToken,
      refreshToken: authenticated.refreshToken,
      abilities,
    });
  }

  @Delete('logout')
  @UseGuards(AccessAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@AuthPayload() payload: ProfileEntity) {
    await this.logoutUseCase.logout(payload);
  }
}
