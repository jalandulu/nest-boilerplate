import { Reflector } from '@nestjs/core';
import { PermissionSlug } from 'src/cores/consts';

export const Permissions = Reflector.createDecorator<PermissionSlug[] | undefined>();
