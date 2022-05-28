import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Post,
  Param,
  Patch,
} from '@nestjs/common';
import { IRequestUser, RequestUser } from 'src/auth/decorators/user.decorator';
import {
  CreateCommentParamsDTO,
  CreateCommentRequestDTO,
} from 'src/comments/dto/create-comment.dto';
import { ECommentableResourceType } from 'src/comments/enum/commentable-resource-type.enum';
import { CommentsService } from 'src/comments/services/comments.service';
import { CreateFeedbackRequestDTO } from '../dto/create-feedback.dto';
import {
  UpdateFeedbackParamsDTO,
  UpdateFeedbackRequestDTO,
} from '../dto/update-feedback.dto';
import { GetAllFeedbackQueryParamsDTO } from '../dto/find-all-feedback.dto';
import { FindFeedbackByIdDTO } from '../dto/find-by-id.dto';
import { FeedbackService } from '../services/feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(
    private feedbackService: FeedbackService,
    private commentsService: CommentsService,
  ) {}

  @Get()
  findAll(
    @Query()
    queryParams: GetAllFeedbackQueryParamsDTO,
    @RequestUser() user: IRequestUser,
  ) {
    return this.feedbackService.findAll({
      filters: queryParams.filters,
      pagination: queryParams.pagination,
      user,
    });
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

  @Patch(':id')
  update(
    @Body() body: UpdateFeedbackRequestDTO,
    @Param() params: UpdateFeedbackParamsDTO,
    @RequestUser() user: IRequestUser,
  ) {
    try {
      const dto = { ...body, authorId: user.userId };
      const { id } = params;
      return this.feedbackService.update({ dto, id });
    } catch (error) {
      throw new HttpException(
        'Could not update feedback',
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
