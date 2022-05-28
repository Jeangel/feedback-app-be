import { IRequestUser } from 'src/auth/decorators/user.decorator';

export interface IWithRequestUser {
  user: IRequestUser;
}
