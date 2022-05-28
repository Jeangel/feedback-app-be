import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { TransformFromMongoId } from 'src/util/decorators/transform-from-mongo-id.decorator';

export class FindFeedbackByIdParamsDTO {
  @IsString()
  id: string;
}

@Exclude()
export class FindFeedbackByIdResponseDTO {
  @Expose()
  id: string;
  @Expose()
  @TransformFromMongoId()
  authorId: string;
  @Expose()
  category: string;
  @Expose()
  title: string;
  @Expose()
  description: string;

  constructor(data: Partial<FindFeedbackByIdResponseDTO>) {
    Object.assign(this, data);
  }
}
