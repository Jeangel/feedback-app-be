import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { TransformFromMongoId } from 'src/util/decorators/transform-from-mongo-id.decorator';
import { IWithRequestUser } from 'src/util/types';
import { MyVoteDTO } from 'src/votes/dto/my-vote.dto';
import { ESuggestionStatus } from '../enum/suggestion-status';

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
  @TransformFromMongoId()
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
  @Expose()
  status: ESuggestionStatus;

  constructor(data: Partial<FindSuggestionByIdResponseDTO>) {
    Object.assign(this, data);
  }
}
