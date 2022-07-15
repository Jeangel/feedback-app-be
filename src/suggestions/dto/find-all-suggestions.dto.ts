import { ESuggestionCategory } from '../enum/suggestion-category';
import { IsArray, IsEnum, ValidateNested, IsOptional } from 'class-validator';
import { TransformFromSerialized } from 'src/util/decorators/transform-from-serialized.decorator';
import { Exclude, Expose, Type } from 'class-transformer';
import { WithPaginationAndSorting } from 'src/util/dto/WithPaginationAndSorting';
import { TransformFromMongoId } from 'src/util/decorators/transform-from-mongo-id.decorator';
import { IWithRequestUser } from 'src/util/types';
import { MyVoteDTO } from 'src/votes/dto/my-vote.dto';
import { PaginationResponse } from 'src/util/dto/Pagination.dto';

class FindAllSuggestionsFiltersDTO {
  @IsArray()
  @IsEnum(ESuggestionCategory, {
    each: true,
    message: 'Categories must include only valid suggestion categories',
  })
  categories: ESuggestionCategory[] = [];
}

export class FindAllSuggestionsQueryParamsDTO extends WithPaginationAndSorting {
  @IsOptional()
  @ValidateNested()
  @Type(() => FindAllSuggestionsFiltersDTO)
  @TransformFromSerialized(FindAllSuggestionsFiltersDTO)
  filters = new FindAllSuggestionsFiltersDTO();
}

export interface FindAllSuggestionsRequestDTO
  extends FindAllSuggestionsQueryParamsDTO,
    IWithRequestUser {}

@Exclude()
export class FindAllSuggestionsItemResponseDTO {
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
  @TransformFromMongoId()
  authorId: string;
  @Expose()
  commentsCount: number;
  @Expose()
  votesCount: number;
  @Expose()
  @Type(() => MyVoteDTO)
  myVote: MyVoteDTO;

  constructor(data: Partial<FindAllSuggestionsItemResponseDTO>) {
    Object.assign(this, data);
  }
}

@Exclude()
export class FindAllSuggestionsResponseDTO {
  @Expose()
  @Type(() => FindAllSuggestionsItemResponseDTO)
  results: FindAllSuggestionsItemResponseDTO[];
  @Expose()
  @Type(() => PaginationResponse)
  pagination: PaginationResponse;
}
