import { OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty, Length, IsEnum, IsMongoId } from 'class-validator';
import { EFeedbackCategory } from '../enum/feedback-category';

export class CreateFeedbackRequestDTO {
  @Length(5, 50)
  title: string;
  @Length(20, 600)
  description: string;
  @IsNotEmpty()
  @IsEnum(EFeedbackCategory)
  category: EFeedbackCategory;
  @IsMongoId()
  authorId: string;
}

export class CreateFeedbackBodyDTO extends OmitType(CreateFeedbackRequestDTO, [
  'authorId',
] as const) {}
