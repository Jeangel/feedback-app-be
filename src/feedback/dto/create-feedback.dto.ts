import { OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty, Length, IsEnum, IsMongoId } from 'class-validator';
import { EFeedbackCategory } from '../enum/feedback-category';

export class CreateFeedbackDTO {
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

export class CreateFeedbackWithoutUserDTO extends OmitType(CreateFeedbackDTO, [
  'authorId',
] as const) {}
