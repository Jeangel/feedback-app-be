import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateFeedbackRequestDTO } from '../dto/create-feedback.dto';
import { UpdateFeedbackRequestDTO } from '../dto/update-feedback.dto';
import {
  FindAllFeedbackRequestDTO,
  FindAllFeedbackResponseDTO,
  FindAllFeedbackItemResponseDTO,
} from '../dto/find-all-feedback.dto';
import { Feedback, FeedbackDocument } from '../schemas/feedback.schema';
import { sanitizeAggregationPipeline } from 'src/util/aggregation';
import { FindFeedbackByIdResponseDTO } from '../dto/find-feedback-by-id.dto';
import { plainToClass } from 'class-transformer';

interface IUpdateFeedbackArgs {
  id: string;
  dto: UpdateFeedbackRequestDTO;
}

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name)
    private feedbackModel: Model<FeedbackDocument>,
  ) {}
  async create(dto: CreateFeedbackRequestDTO) {
    try {
      const feedback = new this.feedbackModel(dto);
      const createdFeedback = await feedback.save();
      return this.findById(createdFeedback._id);
    } catch (error) {
      throw error;
    }
  }
  async update({ dto, id }: IUpdateFeedbackArgs) {
    try {
      const feedback = await this.feedbackModel.findById(id);
      if (!feedback) {
        throw new Error('Feedback not found');
      }
      feedback.set(dto);
      const updatedFeedback = await feedback.save();
      return this.findById(updatedFeedback._id);
    } catch (error) {
      throw error;
    }
  }
  exists(feedbackId: string) {
    return this.feedbackModel.exists({ _id: feedbackId });
  }
  async findAll({
    filters,
    pagination,
    sort,
    user,
  }: FindAllFeedbackRequestDTO): Promise<FindAllFeedbackResponseDTO> {
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
        skip,
        limit,
        joinVotes,
        calculateVotes,
        sort,
        unsetUnnecessaryFields,
      ];
      const aggregationResponse = await this.feedbackModel.aggregate(
        sanitizeAggregationPipeline(steps),
      );
      const count = await this.feedbackModel.count(matchFilters || {});
      const results = aggregationResponse.map(
        (item) => new FindAllFeedbackItemResponseDTO(item),
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
      console.log('ERROR RETURNING FEEDBACK', error);
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
    const feedback = await this.feedbackModel.findById(id);
    return plainToClass(FindFeedbackByIdResponseDTO, feedback);
  }
}
