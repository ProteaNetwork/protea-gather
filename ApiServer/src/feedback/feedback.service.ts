import { Injectable, Inject } from '@nestjs/common';
import { Schemas, Modules } from 'src/app.constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeedbackDocument } from './feedback.schema';
import { EmailService } from 'src/emailManager/email.service';

@Injectable()
export class FeedbackService {
  constructor(
    @Inject(Modules.Logger) logger,
    @InjectModel(Schemas.Feedback) private readonly feedbackResponsitory: Model<FeedbackDocument>,
    private readonly emailService: EmailService)
  {
  }

  async forwardFeedback(data: {feedback: string, browser: string,  address: string}, networkId: number): Promise<FeedbackDocument>{
    const feedbackDoc = await new this.feedbackResponsitory(data);
    feedbackDoc.networkId = networkId;
    feedbackDoc.save();
    this.emailService.sendMail(data.address, data.feedback, data.browser, "Bug", networkId)
    return feedbackDoc.toObject();
  }
}
