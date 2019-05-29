import { Schema, Document } from 'mongoose';

export interface Feedback {
  address: String;
  feedback: String;
  browser: String;
  networkId: Number;
}

export interface FeedbackDocument extends Feedback, Document { }

export const FeedbackSchema = new Schema({
  address: { type: String, required: true, indexed: true },
  feedback: { type: String, required: true },
  browser:  { type: String, required: true },
  networkId: { type: Number, required: false}
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

