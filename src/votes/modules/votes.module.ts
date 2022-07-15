import { Module } from '@nestjs/common';
import { VotesService } from '../services/votes.service';
import { VotesController } from '../controllers/votes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vote, VoteSchema } from '../schemas/vote.schema';
import { SuggestionsModule } from 'src/suggestions/modules/suggestions.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Vote.name,
        schema: VoteSchema,
      },
    ]),
    SuggestionsModule,
  ],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}
