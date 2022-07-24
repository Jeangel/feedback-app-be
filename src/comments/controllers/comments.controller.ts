import { Body, Controller, Post, Param } from '@nestjs/common';
import { RequestUserId, RequestUser } from 'src/auth/decorators/user.decorator';
import { CommentsService } from 'src/comments/services/comments.service';
import {
  CreateReplyBodyDTO,
  CreateReplyParamsDTO,
} from '../dto/create-reply-dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}
  @Post(':commentId/reply')
  async addComment(
    @Body() body: CreateReplyBodyDTO,
    @Param() params: CreateReplyParamsDTO,
    @RequestUser() authorId: RequestUserId,
  ) {
    return this.commentsService.addReply({
      ...body,
      commentId: params.commentId,
      authorId,
    });
  }
}
