import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginRequest, RegisterRequest } from '../requests';
import { AuthMapper } from '../mappers/auth.mapper';
import { LoginUseCase, RefreshUseCase, RegisterUseCase } from '../use-cases';
import { LogoutUseCase } from '../use-cases/logout.use-case';
import { JwtEntity, LocalAuthEntity } from 'src/cores/entities';
import {
  AccessAuthGuard,
  LocalAuthGuard,
  RefreshAuthGuard,
} from 'src/middlewares/guards';
import { AuthPayload } from 'src/common/decorators';

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
  async register(@Body() registerRequest: RegisterRequest) {
    const { user, authenticated, abilities } =
      await this.registerUseCase.register(registerRequest);

    return this.authMapper.toMap({
      profile: user,
      accessToken: authenticated.accessToken,
      refreshToken: authenticated.refreshToken,
      abilities,
    });
  }

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  async refresh(@AuthPayload() payload: JwtEntity) {
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
  async logout(@AuthPayload() payload: JwtEntity) {
    await this.logoutUseCase.logout(payload);
  }
}
