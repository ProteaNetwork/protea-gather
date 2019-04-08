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
    // DEBUG used only in populating new instances
    // if(!doc){
    //   const eventDoc = await new this.eventRepository({
    //     eventId: eventId,
    //     eventManagerAddress: "0x4Ce301a9F7a83C9bFAE3a4F06ad2Fe5404c62430",
    //     maxAttendees: 0,
    //     name: "Test event",
    //     organizer: "0xfaecAE4464591F8f2025ba8ACF58087953E613b1",
    //     requiredDai: 2,
    //     state: 1
    //   });
    //   eventDoc.save();
      // return eventDoc.toObject();
    // }
    return doc ? doc.toObject() : false;
  }

  async createEvent(eventData: EventDTO, bannerImage): Promise<EventDocument>{
    const eventDoc = await new this.eventRepository(eventData);
    const attachment = await this.attachmentService.create({
      filename: `${eventData.eventId}-${bannerImage.originalname}`,
      contentType: bannerImage.mimetype
    }, bannerImage);
    eventDoc.bannerImage = attachment;

    eventDoc.save();
    return eventDoc.toObject();
  }

  async updateEvent(eventData: EventDTO): Promise<EventDocument>{
    const doc = await this.eventRepository.findOne({tbcAddress: eventData.eventId});
    Object.keys(eventData).forEach(key => {
      doc[key] = eventData[key];
    });

    doc.save();
    return doc.toObject();
  }
}
