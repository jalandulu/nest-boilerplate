import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AccessAuthGuard } from 'src/middlewares/guards';
import {
  CreateUserRequest,
  QueryUserRequest,
  UpdateUserRequest,
} from '../requests';
import { MultipartInterceptor } from 'src/infrastructures/storage/interceptors';
import { Files } from 'src/infrastructures/storage/decorators';
import { S3 } from 'src/infrastructures/storage/globals';
import { UserPictureUseCase, UserUseCase } from '../use-cases';
import { FileMapper, UserMapper } from 'src/middlewares/interceptors';

@ApiTags('User')
@UseGuards(AccessAuthGuard)
@Controller({
  path: 'users',
  version: '1.0',
})
export class UserController {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly fileMapper: FileMapper,
    private readonly userUseCase: UserUseCase,
    private readonly userPictureUseCase: UserPictureUseCase,
  ) {}

  @Get()
  async findAll(@Query() query: QueryUserRequest) {
    const [users, meta] = await this.userUseCase.findAll(query);

    return await this.userMapper.toPaginate(users, meta);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userMapper.toMap(await this.userUseCase.findOne(id));
  }

  @Post()
  async create(@Body() payload: CreateUserRequest) {
    return await this.userMapper.toMap(await this.userUseCase.create(payload));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateUserRequest) {
    return await this.userMapper.toMap(
      await this.userUseCase.update(id, payload),
    );
  }

  @Patch(':id/picture')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(MultipartInterceptor({ maxFileSize: 1000_000 }))
  async updatePicture(
    @Param('id') id: string,
    @Files() files: Record<string, S3.MultipartFile[]>,
  ) {
    const [file] = files.file;
    const updated = await this.userPictureUseCase.updatePicture(id, file);

    return await this.fileMapper.toMap(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.userUseCase.remove(id);
  }
}