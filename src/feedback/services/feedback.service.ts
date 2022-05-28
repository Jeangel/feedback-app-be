import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFeedbackDTO } from '../dto/create-feedback.dto';
import { UpdateFeedbackDTO } from '../dto/update-feedback.dto';
import {
  GetAllFeedbackQueryParamsDTO,
  FeedbackListItemResponseDTO,
} from '../dto/find-all-feedback.dto';
import { Feedback, FeedbackDocument } from '../schemas/feedback.schema';
import { IWithRequestUser } from 'src/util/types';
import { sanitizeAggregationPipeline } from 'src/util/aggregation';

interface IFindAllArgs extends GetAllFeedbackQueryParamsDTO, IWithRequestUser {}

interface IUpdateFeedbackArgs {
  id: string;
  dto: UpdateFeedbackDTO;
}

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name)
    private feedbackModel: Model<FeedbackDocument>,
  ) {}
  async create(dto: CreateFeedbackDTO) {
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
    user,
  }: IFindAllArgs): Promise<FeedbackListItemResponseDTO[]> {
    const makeMatchFilters = () => {
      const matchFilters: any = {};
      if (filters.categories.length) {
        matchFilters.category = { $in: filters.categories };
      }
      const hasFilters = Object.keys(matchFilters).length;
      return hasFilters ? { $match: matchFilters } : undefined;
    };
    try {
      const matchFilters = makeMatchFilters();
      const skip = { $skip: pagination.offset * pagination.limit };
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
          voteCount: { $sum: '$votes.value' },
          vote: {
            $first: {
              $filter: {
                input: '$votes',
                as: 'vote',
                cond: { $eq: ['$$vote.authorId', user.userId] },
              },
            },
          },
        },
      };
      const unsetUnnecessaryFields = {
        $unset: ['votes', '__v', 'updatedAt', 'createdAt'],
      };
      const steps = [
        matchFilters,
        skip,
        limit,
        joinVotes,
        calculateVotes,
        unsetUnnecessaryFields,
      ];
      const result = await this.feedbackModel.aggregate(
        sanitizeAggregationPipeline(steps),
      );
      return result;
    } catch (error) {
      console.log('ERROR RETURNING FEEDBACK', error);
      return [];
    }
  }
  findById(id: string) {
    return this.feedbackModel.findById(id).exec();
  }
}
