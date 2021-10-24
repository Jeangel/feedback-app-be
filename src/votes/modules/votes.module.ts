import { Module } from '@nestjs/common';
import { VotesService } from '../services/votes.service';
import { VotesController } from '../controllers/votes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteEntity } from '../entities/vote.entity';
import { FeedbackModule } from 'src/feedback/modules/feedback.module';

@Module({
  imports: [TypeOrmModule.forFeature([VoteEntity]), FeedbackModule],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}
