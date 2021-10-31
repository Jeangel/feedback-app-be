import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackController } from '../controllers/feedback.controller';
import { Feedback, FeedbackSchema } from '../schemas/feedback.schema';
import { FeedbackService } from '../services/feedback.service';
import { CommentsModule } from '../../comments/modules/comments.module';

@Module({
  imports: [
    CommentsModule,
    MongooseModule.forFeature([
      {
        name: Feedback.name,
        schema: FeedbackSchema,
      },
    ]),
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService, MongooseModule],
})
export class FeedbackModule {}
