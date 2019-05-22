import { Schema, Document } from 'mongoose';
import { Schemas } from 'src/app.constants';
import { AttachmentDocument } from 'src/attachments/attachment.schema';
import { ObjectId } from 'bson';

export interface Event {
  eventId: string;
  eventManagerAddress: string;
  organizer: string;

  name: string;
  bannerImage: AttachmentDocument | ObjectId;
  description: string;
  eventDate: Date;
  networkId: number;
}

export interface EventDocument extends Event, Document { }

export const EventSchema = new Schema({
  eventId: {type: String, required: true },
  eventManagerAddress: { type: String, required: true },
  organizer: {type: String, required: true },
  bannerImage: {type: Schema.Types.ObjectId, ref: Schemas.Attachment},

  name: { type: String, required: true },
  description: { type: String, required: false },
  eventDate: { type: Date, required: false},
  networkId: { type: Number, required: true},
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

