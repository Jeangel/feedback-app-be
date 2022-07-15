import { OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty, Length, IsEnum, IsMongoId } from 'class-validator';
import { ESuggestionCategory } from '../enum/suggestion-category';

export class CreateSuggestionRequestDTO {
  @Length(5, 50)
  title: string;
  @Length(20, 600)
  description: string;
  @IsNotEmpty()
  @IsEnum(ESuggestionCategory)
  category: ESuggestionCategory;
  @IsMongoId()
  authorId: string;
}

export class CreateSuggestionBodyDTO extends OmitType(
  CreateSuggestionRequestDTO,
  ['authorId'] as const,
) {}
