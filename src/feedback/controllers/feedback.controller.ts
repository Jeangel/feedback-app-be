import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateFeedbackDTO } from '../dto/create-feedback.dto';
import { FeedbackService } from '../services/feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.feedbackService.findAll();
  }

  @Post()
  create(@Body() body: CreateFeedbackDTO) {
    try {
      return this.feedbackService.create(body);
    } catch (error) {
      throw new HttpException(
        'Could not create feedback',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
