import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateSuggestionRequestDTO } from '../dto/create-suggestion.dto';
import { UpdateSuggestionRequestDTO } from '../dto/update-suggestion.dto';
import {
  FindAllSuggestionsRequestDTO,
  FindAllSuggestionsResponseDTO,
  FindAllSuggestionsItemResponseDTO,
} from '../dto/find-all-suggestions.dto';
import { Suggestion, SuggestionDocument } from '../schemas/suggestion.schema';
import { sanitizeAggregationPipeline } from 'src/util/aggregation';
import { FindSuggestionByIdResponseDTO } from '../dto/find-suggestion-by-id.dto';
import { plainToClass } from 'class-transformer';

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
      const suggestion = await this.suggestionModel.findById(id);
      if (!suggestion) {
        throw new Error('Suggestion not found');
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
    user,
  }: FindAllSuggestionsRequestDTO): Promise<FindAllSuggestionsResponseDTO> {
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
      const joinVotes = {
        $lookup: {
          from: 'votes',
          localField: '_id',
          foreignField: 'resourceId',
          as: 'votes',
        },
      };
      const calculateVotes = {
        $addFields: {
          votesCount: { $sum: '$votes.value' },
          myVote: {
            $first: {
              $filter: {
                input: '$votes',
                as: 'vote',
                cond: {
                  $eq: ['$$vote.authorId', new Types.ObjectId(user.userId)],
                },
              },
            },
          },
        },
      };
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
        joinVotes,
        calculateVotes,
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
  async findById(id: string) {
    const suggestion = await this.suggestionModel.findById(id);
    return plainToClass(FindSuggestionByIdResponseDTO, suggestion);
  }
}
