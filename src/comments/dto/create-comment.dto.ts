import { IsEnum, MaxLength } from 'class-validator';
import { OmitType, PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ECommentableResourceType } from '../enum/commentable-resource-type.enum';

export class CreateCommentRequestDTO {
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

export class CreateCommentBodyDTO extends OmitType(CreateCommentRequestDTO, [
  'authorId',
  'resourceType',
  'resourceId',
] as const) {}

export class CreateCommentParamsDTO extends PickType(CreateCommentRequestDTO, [
  'resourceId',
] as const) {}
