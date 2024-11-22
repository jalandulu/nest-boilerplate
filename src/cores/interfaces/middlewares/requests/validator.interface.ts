import { ValidationOptions as ClassValidatorValidationOptions } from 'class-validator';

export interface ValidationOptions extends ClassValidatorValidationOptions {
  targetParam?: string;
}
