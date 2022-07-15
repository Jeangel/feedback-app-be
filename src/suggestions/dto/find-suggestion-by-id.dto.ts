import { Exclude, Expose, Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { TransformFromMongoId } from 'src/util/decorators/transform-from-mongo-id.decorator';

export class FindSuggestionByIdParamsDTO {
  @IsString()
  id: string;
}

@Exclude()
export class FindSuggestionByIdResponseDTO {
  @Expose()
  @Transform((value) => value.obj._id.toString())
  _id: string;
  @Expose()
  @TransformFromMongoId()
  authorId: string;
  @Expose()
  category: string;
  @Expose()
  title: string;
  @Expose()
  description: string;

  constructor(data: Partial<FindSuggestionByIdResponseDTO>) {
    Object.assign(this, data);
  }
}
