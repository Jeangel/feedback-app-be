import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Post,
  Param,
} from '@nestjs/common';
import { IRequestUser, RequestUser } from 'src/auth/decorators/user.decorator';
import {
  CreateCommentParamsDTO,
  CreateCommentRequestDTO,
} from 'src/comments/dto/create-comment.dto';
import { ECommentableResourceType } from 'src/comments/enum/commentable-resource-type.enum';
import { CommentsService } from 'src/comments/services/comments.service';
import { CreateFeedbackRequestDTO } from '../dto/create-feedback.dto';
import { GetAllFeedbackQueryParamsDTO } from '../dto/feedback-filter-params.dto';
import { FindFeedbackByIdDTO } from '../dto/find-by-id.dto';
import { FeedbackService } from '../services/feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(
    private feedbackService: FeedbackService,
    private commentsService: CommentsService,
  ) {}

  @Get()
  findAll(@Query() queryParams: GetAllFeedbackQueryParamsDTO) {
    return this.feedbackService.findAll({ filters: queryParams });
  }

  @Get('/:id')
  findById(@Param() params: FindFeedbackByIdDTO) {
    return this.feedbackService.findById(params.id);
  }

  @Post()
  create(
    @Body() body: CreateFeedbackRequestDTO,
    @RequestUser() user: IRequestUser,
  ) {
    try {
      return this.feedbackService.create({ ...body, authorId: user.userId });
    } catch (error) {
      throw new HttpException(
        'Could not create feedback',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':resourceId/comments')
  getComments(@Param() params: CreateCommentParamsDTO) {
    return this.commentsService.findByResourceId({
      resourceId: params.resourceId,
    });
  }

  @Post(':resourceId/comments')
  addComment(
    @Body() commentRequestDTO: CreateCommentRequestDTO,
    @Param() params: CreateCommentParamsDTO,
    @RequestUser() user: IRequestUser,
  ) {
    return this.commentsService.create({
      ...commentRequestDTO,
      authorId: user.userId,
      resourceId: params.resourceId,
      resourceType: ECommentableResourceType.feedback,
    });
  }
}
