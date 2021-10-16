import { Module } from '@nestjs/common';
import { FeedbackController } from '../controllers/feedback.controller';

@Module({
  controllers: [FeedbackController],
})
export class FeedbackModule {}
