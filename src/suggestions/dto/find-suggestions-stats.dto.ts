import { Exclude, Expose } from 'class-transformer';
import { TransformFromMongoId } from 'src/util/decorators/transform-from-mongo-id.decorator';
import { IWithRequestUser } from 'src/util/types';
import { SuggestionStatusValue } from '../enum/suggestion-status';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFindSuggestionsStatsRequestDTO extends IWithRequestUser {}

@Exclude()
export class FindBoardSuggestionsItemResponseDTO {
  @Expose()
  @TransformFromMongoId()
  _id: string;

  constructor(data: Partial<FindBoardSuggestionsItemResponseDTO>) {
    Object.assign(this, data);
  }
}

@Exclude()
export class FindSuggestionsStatsResponseDTO {
  countByStatus: {
    [K in SuggestionStatusValue]: number;
  };
  constructor(data: Partial<FindSuggestionsStatsResponseDTO>) {
    Object.assign(this, data);
  }
}
