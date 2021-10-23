import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);

export interface IRequestUser {
  userId: string;
  username: string;
}
