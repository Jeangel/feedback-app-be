import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { TransformFromMongoId } from 'src/util/decorators/transform-from-mongo-id.decorator';
import { IWithRequestUser } from 'src/util/types';
import { MyVoteDTO } from 'src/votes/dto/my-vote.dto';

export class FindSuggestionByIdParamsDTO {
  @IsString()
  id: string;
}

export interface IFindSuggestionByIdRequestDTO
  extends FindSuggestionByIdParamsDTO,
    IWithRequestUser {}

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
  @Expose()
  commentsCount: number;
  @Expose()
  votesCount: number;
  @Expose()
  @Type(() => MyVoteDTO)
  myVote: MyVoteDTO;

  constructor(data: Partial<FindSuggestionByIdResponseDTO>) {
    Object.assign(this, data);
  }
}
