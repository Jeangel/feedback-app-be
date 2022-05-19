import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { EFeedbackStatus } from '../enum/feedback-status';
import { CreateFeedbackDTO } from './create-feedback.dto';

export class UpdateFeedbackDTO extends PartialType(CreateFeedbackDTO) {
  @IsEnum(EFeedbackStatus)
  @IsOptional()
  status?: EFeedbackStatus;
}

export class UpdateFeedbackRequestDTO extends OmitType(UpdateFeedbackDTO, [
  'authorId',
] as const) {}

export class UpdateFeedbackParamsDTO {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
