import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateSuggestionRequestDTO } from '../dto/create-suggestion.dto';
import { UpdateSuggestionRequestDTO } from '../dto/update-suggestion.dto';
import {
  IFindAllSuggestionsRequestDTO,
  FindAllSuggestionsResponseDTO,
  FindAllSuggestionsItemResponseDTO,
} from '../dto/find-all-suggestions.dto';
import { Suggestion, SuggestionDocument } from '../schemas/suggestion.schema';
import { sanitizeAggregationPipeline } from 'src/util/aggregation';
import {
  FindSuggestionByIdResponseDTO,
  IFindSuggestionByIdRequestDTO,
} from '../dto/find-suggestion-by-id.dto';
import {
  makeBoardAggregate,
  makeCalculateCommentsAggregate,
  makeCalculateVotesAggregate,
  sortBoardSuggestionColumns,
} from './utils';
import {
  FindBoardColumnDTO,
  FindBoardSuggestionsResponseDTO,
  IFindBoardSuggestionsRequestDTO,
} from '../dto/find-board-suggestions.dto';

interface IUpdateSuggestionArgs {
  id: string;
  dto: UpdateSuggestionRequestDTO;
}

@Injectable()
export class SuggestionsService {
  constructor(
    @InjectModel(Suggestion.name)
    private suggestionModel: Model<SuggestionDocument>,
  ) {}
  async create(dto: CreateSuggestionRequestDTO) {
    try {
      const suggestion = new this.suggestionModel(dto);
      const createdSuggestion = await suggestion.save();
      return this.findById(createdSuggestion._id);
    } catch (error) {
      throw error;
    }
  }
  async update({ dto, id }: IUpdateSuggestionArgs) {
    try {
      const suggestion = await this.suggestionModel.findById(id).exec();
      if (!suggestion) {
        throw new HttpException(
          'Could not find suggestion with the given id',
          HttpStatus.NOT_FOUND,
        );
      }

      if (
        dto.authorId &&
        dto.authorId !== (suggestion.authorId as unknown as string).toString()
      ) {
        throw new HttpException(
          'You cannot update this suggestion',
          HttpStatus.FORBIDDEN,
        );
      }
      suggestion.set(dto);
      const updatedSuggestion = await suggestion.save();
      return this.findById(updatedSuggestion._id);
    } catch (error) {
      throw error;
    }
  }
  exists(suggestionId: string) {
    return this.suggestionModel.exists({ _id: suggestionId });
  }
  async findAll({
    filters,
    pagination,
    sort,
    userId,
  }: IFindAllSuggestionsRequestDTO): Promise<FindAllSuggestionsResponseDTO> {
    const makeMatchFiltersStage = () => {
      const matchFilters: any = {};
      if (filters.categories.length) {
        matchFilters.category = { $in: filters.categories };
      }
      const hasFilters = Object.keys(matchFilters).length;
      return hasFilters ? { $match: matchFilters } : undefined;
    };
    const makeSortStage = () => {
      const sortStage: any = {};
      if (sort && sort.by) {
        sortStage[sort.by] = sort.order;
      }
      const hasSorting = Object.keys(sortStage).length;
      return hasSorting ? { $sort: sortStage } : undefined;
    };
    try {
      const matchFilters = makeMatchFiltersStage();
      const skip = { $skip: (pagination.page - 1) * pagination.limit };
      const limit = { $limit: pagination.limit };
      const calculateVotesAggregate = makeCalculateVotesAggregate(userId);
      const calculateCommentsAggregate = makeCalculateCommentsAggregate();
      const sort = makeSortStage();
      const unsetUnnecessaryFields = {
        $unset: [
          'votes',
          '__v',
          'updatedAt',
          'createdAt',
          'myVote.authorId',
          'myVote.resourceType',
          'myVote.resourceId',
        ],
      };
      const steps = [
        matchFilters,
        ...calculateVotesAggregate,
        ...calculateCommentsAggregate,
        sort,
        skip,
        limit,
        unsetUnnecessaryFields,
      ];
      const aggregationResponse = await this.suggestionModel.aggregate(
        sanitizeAggregationPipeline(steps),
      );
      const count = await this.suggestionModel.count(
        matchFilters?.$match || {},
      );
      const results = aggregationResponse.map(
        (item) => new FindAllSuggestionsItemResponseDTO(item),
      );
      return {
        results,
        pagination: {
          total: count,
          pages: Math.ceil(count / pagination.limit),
          currentPage: pagination.page,
        },
      };
    } catch (error) {
      console.log('ERROR RETURNING SUGGESTION', error);
      return {
        results: [],
        pagination: {
          total: 0,
          currentPage: 0,
          pages: 0,
        },
      };
    }
  }
  async findById({ id, userId }: IFindSuggestionByIdRequestDTO) {
    try {
      const matchFilters = { $match: { _id: new Types.ObjectId(id) } };
      const limit = { $limit: 1 };
      const calculateVotesAggregate = makeCalculateVotesAggregate(userId);
      const calculateCommentsAggregate = makeCalculateCommentsAggregate();
      const unsetUnnecessaryFields = {
        $unset: [
          'votes',
          '__v',
          'updatedAt',
          'createdAt',
          'myVote.authorId',
          'myVote.resourceType',
          'myVote.resourceId',
        ],
      };
      const steps = [
        matchFilters,
        ...calculateVotesAggregate,
        ...calculateCommentsAggregate,
        limit,
        unsetUnnecessaryFields,
      ];
      const aggregationResponse = await this.suggestionModel.aggregate(
        sanitizeAggregationPipeline(steps),
      );
      if (!aggregationResponse.length) {
        throw new HttpException(
          'Could not find suggestion with the given id',
          HttpStatus.NOT_FOUND,
        );
      }
      const results = aggregationResponse.map(
        (item) => new FindSuggestionByIdResponseDTO(item),
      );
      return results[0];
    } catch (error) {
      throw error;
    }
  }
  async findBoardSuggestions({
    userId,
  }: IFindBoardSuggestionsRequestDTO): Promise<FindBoardSuggestionsResponseDTO> {
    try {
      const boardAggregate = makeBoardAggregate();
      const calculateVotesAggregate = makeCalculateVotesAggregate(userId);
      const calculateCommentsAggregate = makeCalculateCommentsAggregate();
      const steps = [
        ...calculateVotesAggregate,
        ...calculateCommentsAggregate,
        ...boardAggregate,
      ];
      const aggregationResponse = await this.suggestionModel.aggregate(
        sanitizeAggregationPipeline(steps),
      );
      const columns = aggregationResponse.map(
        (item) => new FindBoardColumnDTO(item),
      );
      return {
        columns: sortBoardSuggestionColumns(columns),
      };
    } catch (error) {
      return {
        columns: [],
      };
    }
  }
}
