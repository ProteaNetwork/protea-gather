import { Schema, Document } from 'mongoose';
import { Schemas } from 'src/app.constants';
import { AttachmentDocument } from 'src/attachments/attachment.schema';
import { ObjectId } from 'bson';

export interface Community {
  tbcAddress: string;
  eventManagerAddress: string;
  membershipManagerAddress: string;
  bannerImage: AttachmentDocument | ObjectId;
  name: string;
  tokenSymbol: string;
  description: string;
  gradientDenominator: number;
  contributionRate: number;
}

export interface CommunityDocument extends Community, Document { }

export const CommunitySchema = new Schema({
  tbcAddress: { type: String, required: true, indexed: true },
  eventManagerAddress: { type: String, required: false },
  membershipManagerAddress: { type: String, required: false },
  bannerImage: {type: Schema.Types.ObjectId, ref: Schemas.Attachment, required: false},
  name: { type: String, required: false },
  tokenSymbol: { type: String, required: false },
  description: { type: String, required: false },
  gradientDenominator: { type: Number, required: false},
  contributionRate: { type: Number, required: false},
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
