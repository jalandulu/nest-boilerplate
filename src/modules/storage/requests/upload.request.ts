import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StorageCode } from 'src/cores/enums';
import { IsExists } from 'src/middlewares/validators';

export class UploadRequest {
  @ApiProperty({
    description: 'The file code',
    enum: StorageCode,
  })
  @IsString()
  @IsEnum(StorageCode)
  public code!: StorageCode;

  @ApiProperty({
    description: 'The directory path',
    type: String,
  })
  @IsOptional()
  @IsString()
  @IsExists('stgDirectory', 'path')
  public dir?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: S3.MultipartFile;
}

export class MultipleUploadRequest {
  @ApiProperty({
    description: 'The file code',
    enum: StorageCode,
  })
  @IsString()
  @IsEnum(StorageCode)
  public code!: StorageCode;

  @ApiProperty({
    description: 'The directory path',
    type: String,
  })
  @IsOptional()
  @IsString()
  @IsExists('stgDirectory', 'path')
  public dir?: string;

  @ApiProperty({ type: [String], format: 'binary', required: true })
  files: S3.MultipartFile[];
}
