import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { EFeedbackStatus } from '../enum/feedback-status';
import { CreateFeedbackRequestDTO } from './create-feedback.dto';

export class UpdateFeedbackRequestDTO extends PartialType(
  CreateFeedbackRequestDTO,
) {
  @IsEnum(EFeedbackStatus)
  @IsOptional()
  status?: EFeedbackStatus;
}

export class UpdateFeedbackBodyDTO extends OmitType(UpdateFeedbackRequestDTO, [
  'authorId',
] as const) {}

export class UpdateFeedbackParamsDTO {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
