import { Exclude, Expose } from 'class-transformer';
import { TransformFromMongoId } from 'src/util/decorators/transform-from-mongo-id.decorator';

@Exclude()
export class MyVoteDTO {
  @TransformFromMongoId()
  @Expose()
  _id: string;
  @Expose()
  value: number;
}
