import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SuggestionsModule } from 'src/suggestions/modules/suggestions.module';
import { UsersModule } from 'src/users/modules/users.module';
import { Comment, CommentSchema } from '../schemas/comment.schema';
import { Reply, ReplySchema } from '../schemas/reply.schema';
import { CommentsService } from '../services/comments.service';
import { CommentsController } from '../controllers/comments.controller';

@Module({
  imports: [
    forwardRef(() => SuggestionsModule),
    UsersModule,
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
      },
      {
        name: Reply.name,
        schema: ReplySchema,
      },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
