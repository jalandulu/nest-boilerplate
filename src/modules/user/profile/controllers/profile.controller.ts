import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthPayload } from 'src/common/decorators';
import { ProfileEntity } from 'src/cores/entities';
import { AccessAuthGuard } from 'src/middlewares/guards';
import { UpdatePasswordRequest, UpdateProfileRequest } from '../requests';
import { MultipartInterceptor } from 'src/infrastructures/storage/interceptors';
import { Files } from 'src/infrastructures/storage/decorators';
import { S3 } from 'src/infrastructures/storage/globals';
import { IQueueServiceProvider } from 'src/cores/contracts';
import { QueueMailerProcessor } from 'src/cores/consts';
import {
  ProfilePasswordUseCase,
  ProfilePictureUseCase,
  ProfileUseCase,
} from '../use-cases';

@ApiTags('Profile')
@UseGuards(AccessAuthGuard)
@Controller({
  path: 'profile',
  version: '1.0',
})
export class ProfileController {
  constructor(
    private readonly profileUseCase: ProfileUseCase,
    private readonly profilePictureUseCase: ProfilePictureUseCase,
    private readonly profilePasswordUseCase: ProfilePasswordUseCase,
    private readonly queueServiceProvider: IQueueServiceProvider,
  ) {}

  @Get()
  async profile(@AuthPayload() profile: ProfileEntity) {
    return {
      data: profile,
    };
  }

  @Patch('update/profile')
  async updateProfile(
    @Body() payload: UpdateProfileRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    return await this.profileUseCase.update(profile, payload);
  }

  @Patch('update/picture')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(MultipartInterceptor({ maxFileSize: 1000_000 }))
  async updatePicture(
    @Files() files: Record<string, S3.MultipartFile[]>,
    @AuthPayload() profile: ProfileEntity,
  ) {
    const [file] = files.file;
    const updated = await this.profilePictureUseCase.updatePicture(
      profile,
      file,
    );

    return { data: updated };
  }

  @Patch('update/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePassword(
    @Body() payload: UpdatePasswordRequest,
    @AuthPayload() profile: ProfileEntity,
  ) {
    await this.profilePasswordUseCase.updatePassword(profile, payload);
  }

  @Delete('destroy')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@AuthPayload() profile: ProfileEntity) {
    await this.profileUseCase.destroy(profile);

    await this.queueServiceProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: profile.email,
      template: 'account-destroy',
    });
  }
}
