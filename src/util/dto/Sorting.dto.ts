import { Type } from 'class-transformer';
import {
  IsNumber,
  ValidateNested,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { TransformFromSerialized } from '../decorators/transform-from-serialized.decorator';

export enum ESortOrder {
  ASC = 1,
  DESC = -1,
}

export class SortingDTO {
  @IsString()
  by: string;
  @IsNumber()
  @IsOptional()
  @IsEnum(ESortOrder)
  order: ESortOrder = ESortOrder.ASC;
}

export class WithSorting {
  @IsOptional()
  @ValidateNested({ message: 'Sorting must be an object' })
  @Type(() => SortingDTO)
  @TransformFromSerialized(SortingDTO)
  sorting: SortingDTO;
}
