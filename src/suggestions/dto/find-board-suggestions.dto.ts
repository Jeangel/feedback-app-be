import { ESuggestionCategory } from '../enum/suggestion-category';
import { Exclude, Expose, Type } from 'class-transformer';
import { TransformFromMongoId } from 'src/util/decorators/transform-from-mongo-id.decorator';
import { IWithRequestUser } from 'src/util/types';
import { MyVoteDTO } from 'src/votes/dto/my-vote.dto';
import { ESuggestionStatus } from '../enum/suggestion-status';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFindBoardSuggestionsRequestDTO extends IWithRequestUser {}

@Exclude()
export class FindBoardSuggestionsItemResponseDTO {
  @Expose()
  @TransformFromMongoId()
  _id: string;
  @Expose()
  title: string;
  @Expose()
  description: string;
  @Expose()
  category: ESuggestionCategory;
  @Expose()
  status: ESuggestionStatus;
  @Expose()
  @TransformFromMongoId()
  authorId: string;
  @Expose()
  commentsCount: number;
  @Expose()
  votesCount: number;
  @Expose()
  @Type(() => MyVoteDTO)
  myVote: MyVoteDTO;

  constructor(data: Partial<FindBoardSuggestionsItemResponseDTO>) {
    Object.assign(this, data);
  }
}

@Exclude()
export class FindBoardColumnDTO {
  @Expose()
  _id: ESuggestionCategory;
  @Expose()
  description: string;
  @Expose()
  @Type(() => FindBoardSuggestionsItemResponseDTO)
  suggestions: FindBoardSuggestionsItemResponseDTO[];

  constructor(data: Partial<FindBoardColumnDTO>) {
    Object.assign(this, data);
  }
}

@Exclude()
export class FindBoardSuggestionsResponseDTO {
  @Expose()
  @Type(() => FindBoardColumnDTO)
  columns: FindBoardColumnDTO[];
}
