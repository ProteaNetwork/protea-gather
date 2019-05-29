import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Schemas } from 'src/app.constants';
import { FeedbackSchema } from './feedback.schema';
import { EmailService } from 'src/emailManager/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Schemas.Feedback, schema: FeedbackSchema}]),
  ],
  providers: [FeedbackService, EmailService],
  controllers: [FeedbackController]
})
export class FeedbackModule {}

