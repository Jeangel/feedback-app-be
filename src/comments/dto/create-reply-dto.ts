import { OmitType, PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsMongoId, MaxLength } from 'class-validator';

export class CreateReplyRequestDTO {
  @MaxLength(100_000)
  @IsNotEmpty()
  body: string;
  @IsMongoId()
  @IsNotEmpty()
  authorId: string;
  @IsMongoId()
  @IsNotEmpty()
  commentId: string;
}

export class CreateReplyBodyDTO extends OmitType(CreateReplyRequestDTO, [
  'authorId',
  'commentId',
] as const) {}

export class CreateReplyParamsDTO extends PickType(CreateReplyRequestDTO, [
  'commentId',
] as const) {}
