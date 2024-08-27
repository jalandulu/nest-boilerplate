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
import { LoginUseCase, RegisterUseCase } from '../use-cases';
import { LogoutUseCase } from '../use-cases/logout.use-case';
import { JwtEntity, LocalAuthEntity } from 'src/cores/entities';
import { JwtAuthGuard, LocalAuthGuard } from 'src/middlewares/guards';
import { JwtPayload } from 'src/common/decorators';

@ApiTags('Authentication')
@Controller({
  path: 'auth',
  version: '1.0',
})
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly authMapper: AuthMapper,
  ) {}

  @Post('register')
  async register(@Body() registerRequest: RegisterRequest) {
    const { user, authenticated, abilities } =
      await this.registerUseCase.register(registerRequest);

    return this.authMapper.toMap({
      profile: user,
      accessToken: authenticated,
      abilities,
    });
  }

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
      accessToken: authenticated,
      abilities,
    });
  }

  @Delete('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@JwtPayload() payload: JwtEntity) {
    await this.logoutUseCase.logout(payload);
  }
}
