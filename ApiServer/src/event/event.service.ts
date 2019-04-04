import { Injectable, Inject } from '@nestjs/common';
import { Schemas, Modules } from 'src/app.constants';
import { InjectModel } from '@nestjs/mongoose';
import { EventDocument } from './event.schema';
import { Model } from 'mongoose';
import { EventDTO } from './dto/event.dto';

@Injectable()
export class EventService {
  constructor(@Inject(Modules.Logger) logger, @InjectModel(Schemas.Event) private readonly eventRepository: Model<EventDocument>){

  }

  async getEventById(eventId: string): Promise<EventDocument>{
    const doc = await this.eventRepository.findOne({eventId});
    // DEBUG used only in populating new instances
    // if(!doc){
    //   const eventDoc = await new this.eventRepository({
    //     eventId: eventId,
    //     eventManagerAddress: "0xE6dE965a7D0B81921F2b037470C039B351E8aa43",
    //     maxAttendees: 0,
    //     name: "Test event",
    //     organizer: "0xfaecAE4464591F8f2025ba8ACF58087953E613b1",
    //     requiredDai: 2,
    //     state: 1
    //   });
    //   eventDoc.save();
    //   return eventDoc.toObject();
    // }
    return doc ? doc.toObject() : false;
  }

  async createEvent(eventData: EventDTO): Promise<EventDocument>{
    const communityDoc = await new this.eventRepository(eventData);
    communityDoc.save();
    return communityDoc.toObject();
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
