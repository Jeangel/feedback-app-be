import { EFeedbackCategory } from '../enum/feedback-category';
import { IsArray, IsEnum, ValidateNested, IsOptional } from 'class-validator';
import { TransformFromSerialized } from 'src/util/decorators/transform-from-serialized.decorator';
import { Type } from 'class-transformer';
import { WithPagination } from 'src/util/dto/Pagination.dto';

export class GetAllFeedbackFiltersDTO {
  @IsArray()
  @IsEnum(EFeedbackCategory, {
    each: true,
    message: 'Categories must include only valid feedback categories',
  })
  categories: EFeedbackCategory[] = [];
}

export class GetAllFeedbackQueryParamsDTO extends WithPagination {
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
