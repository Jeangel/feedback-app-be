import { OmitType } from '@nestjs/mapped-types';
import { IsNumber, IsIn, IsMongoId, IsEnum } from 'class-validator';
import { EVotableResourceType } from '../enum/votable-resource-type.enum';

export class SaveVoteRequestDTO {
  @IsMongoId()
  resourceId: string;
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 0,
  })
  @IsIn([-1, 0, 1])
  value: number;
  @IsMongoId()
  authorId: string;
  @IsEnum(EVotableResourceType)
  resourceType: EVotableResourceType;
}

export class SaveVoteBodyDTO extends OmitType(SaveVoteRequestDTO, [
  'authorId',
] as const) {}
