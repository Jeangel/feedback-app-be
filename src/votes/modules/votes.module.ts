import { Module } from '@nestjs/common';
import { VotesService } from '../services/votes.service';
import { VotesController } from '../controllers/votes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vote, VoteSchema } from '../schemas/vote.schema';
import { FeedbackModule } from 'src/feedback/modules/feedback.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Vote.name,
        schema: VoteSchema,
      },
    ]),
    FeedbackModule,
  ],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}
