import { Exclude, Expose } from 'class-transformer';
import { TransformFromMongoId } from 'src/util/decorators/transform-from-mongo-id.decorator';

@Exclude()
export class FindUserByIdResponseDTO {
  @TransformFromMongoId()
  @Expose()
  _id: string;
  @Expose()
  fullName: string;
  @Expose()
  avatarUrl: string;
  @Expose()
  username: string;
}
