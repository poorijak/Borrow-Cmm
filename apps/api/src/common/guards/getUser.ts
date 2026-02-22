import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@repo/types';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: User;
}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: RequestWithUser = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
