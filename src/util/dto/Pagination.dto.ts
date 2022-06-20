import { Exclude, Expose, Type } from 'class-transformer';
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
  @Min(1)
  page = 1;
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

@Exclude()
export class PaginationResponse {
  @Expose()
  total: number;
  @Expose()
  pages: number;
  @Expose()
  currentPage: number;
}
