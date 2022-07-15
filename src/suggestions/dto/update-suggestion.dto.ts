import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { ESuggestionStatus } from '../enum/suggestion-status';
import { CreateSuggestionRequestDTO } from './create-suggestion.dto';

export class UpdateSuggestionRequestDTO extends PartialType(
  CreateSuggestionRequestDTO,
) {
  @IsEnum(ESuggestionStatus)
  @IsOptional()
  status?: ESuggestionStatus;
}

export class UpdateSuggestionsBodyDTO extends OmitType(
  UpdateSuggestionRequestDTO,
  ['authorId'] as const,
) {}

export class UpdateSuggestionParamsDTO {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
