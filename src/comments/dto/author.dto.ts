import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/users/schemas/user.schema';
import { TransformFromMongoId } from 'src/util/decorators/transform-from-mongo-id.decorator';

@Exclude()
export class AuthorDTO {
  @TransformFromMongoId()
  @Expose()
  _id: string;
  @Expose()
  fullName: string;
  @Expose()
  avatarUrl: string;
  @Expose()
  username: string;
  constructor(data: Partial<AuthorDTO | User>) {
    Object.assign(this, data);
  }
}
