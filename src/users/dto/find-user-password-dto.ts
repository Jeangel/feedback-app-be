import { Exclude, Expose } from 'class-transformer';
import { TransformFromMongoId } from 'src/util/decorators/transform-from-mongo-id.decorator';

@Exclude()
export class FindUserPasswordResponseDTO {
  @TransformFromMongoId()
  @Expose()
  _id: string;
  @Expose()
  password: string;

  constructor(user: Partial<FindUserPasswordResponseDTO>) {
    Object.assign(this, user);
  }
}
