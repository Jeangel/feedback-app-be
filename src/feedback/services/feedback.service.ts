import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFeedbackDTO } from '../dto/create-feedback.dto';
import { GetAllFeedbackQueryParamsDTO } from '../dto/feedback-filter-params.dto';
import { Feedback, FeedbackDocument } from '../schemas/feedback.schema';

interface IFindAllArgs {
  filters?: GetAllFeedbackQueryParamsDTO;
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
  exists(feedbackId: string) {
    return this.feedbackModel.exists({ _id: feedbackId });
  }
  async findAll({ filters }: IFindAllArgs) {
    try {
      const categoriesFilter = filters.categories.length
        ? { category: { $in: filters.categories } }
        : {};
      return this.feedbackModel.find(categoriesFilter).exec();
    } catch (error) {
      console.log('ERROR RETURNING FEEDBACK');
    }
  }
  findById(id: string) {
    return this.feedbackModel.findById(id).exec();
  }
}
