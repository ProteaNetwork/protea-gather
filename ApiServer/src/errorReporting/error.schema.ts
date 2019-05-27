import { Schema, Document } from 'mongoose';

export interface Error {
  reporterAddress: String;
  errorMessage: String;
  networkId: Number;
}

export interface ErrorDocument extends Error, Document { }

export const ErrorSchema = new Schema({
  reporterAddress: { type: String, required: true, indexed: true },
  errorMessage: { type: String, required: true },
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

