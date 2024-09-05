import {
  FileTypeValidator,
  FileValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { MultipartOptions } from '../interfaces';
import { MultipartFile } from '@fastify/multipart';
import { S3 } from '../globals';

export const getFileFromPart = async (
  part: MultipartFile,
): Promise<S3.MultipartFile> => {
  const buffer = await part.toBuffer();
  return {
    buffer,
    size: buffer.byteLength,
    filename: part.filename,
    mimetype: part.mimetype,
    fieldname: part.fieldname,
  };
};

export const validateFile = (
  file: S3.MultipartFile,
  options: MultipartOptions,
): string | void => {
  const validators: FileValidator[] = [];

  if (options.maxFileSize) {
    validators.push(new MaxFileSizeValidator({ maxSize: options.maxFileSize }));
  }

  if (options.fileType) {
    validators.push(new FileTypeValidator({ fileType: options.fileType }));
  }

  for (const validator of validators) {
    if (validator.isValid(file)) continue;

    return validator.buildErrorMessage(file);
  }
};
