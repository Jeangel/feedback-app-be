import { RequestUserId } from 'src/auth/decorators/user.decorator';

export interface IWithRequestUser {
  userId: RequestUserId;
}
