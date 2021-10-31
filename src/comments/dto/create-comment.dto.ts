import { IsEnum, MaxLength } from 'class-validator';
import { OmitType, PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ECommentableResourceType } from '../enum/commentable-resource-type.enum';

export class CreateCommentDTO {
  @MaxLength(100_000)
  @IsNotEmpty()
  body: string;
  @IsMongoId()
  @IsNotEmpty()
  authorId: string;
  @IsMongoId()
  @IsNotEmpty()
  resourceId: string;
  @IsEnum(ECommentableResourceType)
  resourceType: ECommentableResourceType;
}

export class CreateCommentRequestDTO extends OmitType(CreateCommentDTO, [
  'authorId',
  'resourceType',
  'resourceId',
] as const) {}

export class CreateCommentParamsDTO extends PickType(CreateCommentDTO, [
  'resourceId',
] as const) {}
