import { EFeedbackCategory } from '../enum/feedback-category';
import { IsArray, IsEnum, ValidateNested, IsOptional } from 'class-validator';
import { TransformFromSerialized } from 'src/util/decorators/transform-from-serialized.decorator';
import { Exclude, Expose, Type } from 'class-transformer';
import { WithPaginationAndSorting } from 'src/util/dto/WithPaginationAndSorting';
import { TransformFromMongoId } from 'src/util/decorators/transform-from-mongo-id.decorator';
import { IWithRequestUser } from 'src/util/types';

class FindAllFeedbackFiltersDTO {
  @IsArray()
  @IsEnum(EFeedbackCategory, {
    each: true,
    message: 'Categories must include only valid feedback categories',
  })
  categories: EFeedbackCategory[] = [];
}

export class FindAllFeedbackQueryParamsDTO extends WithPaginationAndSorting {
  @IsOptional()
  @ValidateNested()
  @Type(() => FindAllFeedbackFiltersDTO)
  @TransformFromSerialized(FindAllFeedbackFiltersDTO)
  filters = new FindAllFeedbackFiltersDTO();
}

export interface FindAllFeedbackRequestDTO
  extends FindAllFeedbackQueryParamsDTO,
    IWithRequestUser {}

@Exclude()
export class MyVoteDTO {
  @TransformFromMongoId()
  @Expose()
  _id: string;
  @Expose()
  value: number;
}

@Exclude()
export class FindAllFeedbackItemResponseDTO {
  @Expose()
  @TransformFromMongoId()
  _id: string;
  @Expose()
  title: string;
  @Expose()
  description: string;
  @Expose()
  category: EFeedbackCategory;
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

  constructor(data: Partial<FindAllFeedbackItemResponseDTO>) {
    Object.assign(this, data);
  }
}
