import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { TransformFromSerialized } from '../decorators/transform-from-serialized.decorator';
import { WithPagination } from './Pagination.dto';
import { SortingDTO } from './Sorting.dto';

export class WithPaginationAndSorting extends WithPagination {
  @IsOptional()
  @ValidateNested({ message: 'Sorting must be an object' })
  @Type(() => SortingDTO)
  @TransformFromSerialized(SortingDTO)
  sort?: SortingDTO;
}
