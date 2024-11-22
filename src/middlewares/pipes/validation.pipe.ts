import { PipeTransform, Injectable } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ValidationPipe as NestValidationPipe } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Injectable()
export class ValidationPipe extends NestValidationPipe implements PipeTransform<any> {
  public createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      if (this.isDetailedOutputDisabled) {
        return new HttpErrorByCode[this.errorHttpStatusCode]();
      }

      const errors = this.mapValidationError(validationErrors);
      return new HttpErrorByCode[this.errorHttpStatusCode](errors);
    };
  }

  private mapValidationError(errors: ValidationError[]) {
    const map = (error: ValidationError) => {
      return {
        field: error.property,
        [error.constraints ? 'errors' : 'children']: error.constraints
          ? Object.values(error.constraints)
          : error.children.map(map),
      };
    };

    return errors.map(map);
  }
}
