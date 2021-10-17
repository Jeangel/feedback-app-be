import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFeedbackDTO } from '../dto/create-feedback.dto';
import { FeedbackEntity } from '../entities/feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private feedbackRepository: Repository<FeedbackEntity>,
  ) {}
  create(dto: CreateFeedbackDTO) {
    const feedback = FeedbackEntity.createInstance(dto);
    try {
      return this.feedbackRepository.save(feedback);
    } catch (error) {
      throw error;
    }
  }
  async findAll() {
    try {
      return this.feedbackRepository.find();
    } catch (error) {
      console.log('ERROR RETURNING FEEDBACK');
    }
  }
}
