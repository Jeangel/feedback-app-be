import { Controller, Get } from '@nestjs/common';

@Controller('feedback')
export class FeedbackController {
  @Get('/')
  findAll() {
    return ['Hi', 'There'];
  }
}
