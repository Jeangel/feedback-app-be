import { Transform } from 'class-transformer';
import { IsEnumArray } from 'src/util/decorators/enum-array.decorator';
import { EFeedbackCategory } from '../enum/feedback-category';

export class GetAllFeedbackQueryParamsDTO {
  @Transform(({ value }) => value.split(','))
  @IsEnumArray(EFeedbackCategory, {
    message: 'All values should be a valid feedback category',
  })
  categories?: EFeedbackCategory[] = [];
}
