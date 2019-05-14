import { Injectable, Inject } from '@nestjs/common';
import { Schemas, Modules } from 'src/app.constants';
import { InjectModel } from '@nestjs/mongoose';
import { EventDocument } from './event.schema';
import { Model } from 'mongoose';
import { EventDTO } from './dto/event.dto';
import { AttachmentService } from 'src/attachments/attachment.service';

@Injectable()
export class EventService {
  constructor(
    @Inject(Modules.Logger) logger,
    @InjectModel(Schemas.Event) private readonly eventRepository: Model<EventDocument>,
    private readonly attachmentService: AttachmentService)
  {
  }

  async getEventById(eventId: string): Promise<EventDocument>{
    const doc = await this.eventRepository.findOne({eventId});
    return doc ? doc.toObject() : false;
  }

  async createEvent(eventData: EventDTO, bannerImage): Promise<EventDocument>{
    const eventDoc = await new this.eventRepository(eventData);
    if(bannerImage){
      const attachment = await this.attachmentService.create({
        filename: `${eventData.eventId}-${bannerImage.originalname}`,
        contentType: bannerImage.mimetype
      }, bannerImage);
      eventDoc.bannerImage = attachment;
    }

    eventDoc.save();
    return eventDoc.toObject();
  }

  async updateEvent(eventData: EventDTO, bannerImage): Promise<EventDocument>{
    let eventDoc = await this.eventRepository.findOne({eventId: eventData.eventId});
    if (eventDoc) {
      Object.keys(eventData).forEach(key => {
        eventDoc[key] = eventData[key];
      });
    } else {
      eventDoc = await new this.eventRepository(eventData);
    }

    if (bannerImage) {
      this.attachmentService.delete(eventDoc.bannerImage);
      const attachment = await this.attachmentService.create({
        filename: `${eventDoc.eventId}-${bannerImage.originalname}`,
        contentType: bannerImage.mimetype
      }, bannerImage);
      eventDoc.bannerImage = attachment;
    }

    eventDoc.save();
    return eventDoc.toObject();
  }
}
