import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Post,
} from '@nestjs/common';
import { IRequestUser, RequestUser } from 'src/auth/decorators/user.decorator';
import { CreateFeedbackWithoutUserDTO } from '../dto/create-feedback.dto';
import { GetAllFeedbackQueryParamsDTO } from '../dto/feedback-filter-params.dto';
import { FeedbackService } from '../services/feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Get()
  findAll(@Query() queryParams: GetAllFeedbackQueryParamsDTO) {
    return this.feedbackService.findAll({ filters: queryParams });
  }

  @Post()
  create(
    @Body() body: CreateFeedbackWithoutUserDTO,
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
}
