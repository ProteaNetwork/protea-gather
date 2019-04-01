import { Schema, Document } from 'mongoose';
import { Schemas } from 'src/app.constants';
import { AttachmentDocument } from 'src/attachments/attachment.schema';
import { ObjectId } from 'bson';

export interface Event {
  eventId: string;
  eventManagerAddress: string;
  organizer: string;
  // attendees: string[];
  maxAttendees: number
  requiredDai: number
  state: number;

  name: string;
  banner: AttachmentDocument | ObjectId;
  description: string;
  date: Date;
}

export interface EventDocument extends Event, Document { }

export const EventSchema = new Schema({
  eventId: {type: String, required: true },
  eventManagerAddress: { type: String, required: true },
  organizer: {type: String, required: true },
  // attendees: [{type: String, required: false }],
  maxAttendees: {type: Number, required: true},
  requiredDai: {type: Number, required: true},
  state: {type: Number, required: true},

  name: { type: String, required: true },
  banner: {type: Schema.Types.ObjectId, ref: Schemas.Attachment},
  description: { type: String, required: false },
  date: { type: Date, required: false},
}, {
    timestamps: true,
    toJSON: {
      getters: true,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = String(ret._id);
        delete ret._id;
        return ret;
      },
      virtuals: true,
    },
    toObject: {
      getters: true,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = String(ret._id);
        delete ret._id;
        return ret;
      },
    },
  });

