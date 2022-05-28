import { EFeedbackCategory } from '../enum/feedback-category';
import { IsArray, IsEnum, ValidateNested, IsOptional } from 'class-validator';
import { TransformFromSerialized } from 'src/util/decorators/transform-from-serialized.decorator';
import { Type } from 'class-transformer';
import { WithPaginationAndSorting } from 'src/util/dto/WithPaginationAndSorting';

export class GetAllFeedbackFiltersDTO {
  @IsArray()
  @IsEnum(EFeedbackCategory, {
    each: true,
    message: 'Categories must include only valid feedback categories',
  })
  categories: EFeedbackCategory[] = [];
}

export class GetAllFeedbackQueryParamsDTO extends WithPaginationAndSorting {
  @IsOptional()
  @ValidateNested()
  @Type(() => GetAllFeedbackFiltersDTO)
  @TransformFromSerialized(GetAllFeedbackFiltersDTO)
  filters = new GetAllFeedbackFiltersDTO();
}

export class FeedbackListItemResponseDTO {
  title: string;
  description: string;
  category: EFeedbackCategory;
  authorId: string;
  commentsCount: number;
  votes: number;
}
