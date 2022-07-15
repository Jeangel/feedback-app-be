import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SuggestionsController } from '../controllers/suggestions.controller';
import { Suggestion, SuggestionSchema } from '../schemas/suggestion.schema';
import { SuggestionsService } from '../services/suggestions.service';
import { CommentsModule } from '../../comments/modules/comments.module';

@Module({
  imports: [
    forwardRef(() => CommentsModule),
    MongooseModule.forFeature([
      {
        name: Suggestion.name,
        schema: SuggestionSchema,
      },
    ]),
  ],
  controllers: [SuggestionsController],
  providers: [SuggestionsService],
  exports: [SuggestionsService, MongooseModule],
})
export class SuggestionsModule {}
