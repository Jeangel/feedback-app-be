import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFeedbackDTO } from '../dto/create-feedback.dto';
import { GetAllFeedbackQueryParamsDTO } from '../dto/feedback-filter-params.dto';
import { FeedbackEntity } from '../entities/feedback.entity';

interface IFindAllArgs {
  filters?: GetAllFeedbackQueryParamsDTO;
}

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private feedbackRepository: Repository<FeedbackEntity>,
  ) {}
  create(dto: CreateFeedbackDTO) {
    try {
      const feedback = FeedbackEntity.createInstance(dto);
      return this.feedbackRepository.save(feedback);
    } catch (error) {
      throw error;
    }
  }
  async findAll({ filters }: IFindAllArgs) {
    try {
      const categoriesFilter = filters.categories.length
        ? { category: { $in: filters.categories } }
        : {};
      return this.feedbackRepository.find({
        where: { ...categoriesFilter },
      });
    } catch (error) {
      console.log('ERROR RETURNING FEEDBACK');
    }
  }
}
