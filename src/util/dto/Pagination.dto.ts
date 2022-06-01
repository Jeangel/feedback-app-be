import { Type } from 'class-transformer';
import {
  IsNumber,
  Min,
  Max,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { TransformFromSerialized } from '../decorators/transform-from-serialized.decorator';

export class PaginationDTO {
  @IsNumber()
  @Min(0)
  offset = 0;
  @IsNumber()
  @Min(1)
  @Max(100)
  limit = 10;
}

export class WithPagination {
  @IsOptional()
  @ValidateNested({ message: 'Pagination must be an object' })
  @Type(() => PaginationDTO)
  @TransformFromSerialized(PaginationDTO)
  pagination = new PaginationDTO();
}

export interface PaginatedResponse<T> {
  results: T[];
  total: number;
}
