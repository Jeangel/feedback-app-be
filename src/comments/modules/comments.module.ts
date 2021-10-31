import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackModule } from 'src/feedback/modules/feedback.module';
import { UsersModule } from 'src/users/modules/users.module';
import { Comment, CommentSchema } from '../schemas/comment.schema';
import { CommentsService } from '../services/comments.service';

@Module({
  imports: [
    forwardRef(() => FeedbackModule),
    UsersModule,
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
      },
    ]),
  ],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
