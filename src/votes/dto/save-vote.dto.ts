import { OmitType } from '@nestjs/mapped-types';
import { IsNumber, IsIn, IsMongoId, IsEnum } from 'class-validator';
import { EVotableResourceType } from '../enum/votable-resource-type.enum';

export class SaveVoteDTO {
  @IsMongoId()
  resourceId: string;
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 0,
  })
  @IsIn([-1, 1])
  value: number;
  @IsMongoId()
  authorId: string;
  @IsEnum(EVotableResourceType)
  resourceType: EVotableResourceType;
}

export class SaveVoteRequestDTO extends OmitType(SaveVoteDTO, [
  'authorId',
] as const) {}
