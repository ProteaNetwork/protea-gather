import { Controller, Post, UseGuards, Body, Param } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService){}

  @Post('/:networkId')
  @UseGuards(AuthGuard('jwt'))
  async forwardFeedback(@Body() bodyData: {feedback: string, browser: string, address: string}, @Param('networkId') networkId: number){
    return await this.feedbackService.forwardFeedback(bodyData, networkId);
  }
}
