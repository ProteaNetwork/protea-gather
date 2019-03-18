import { Schema, Document } from 'mongoose';
import { Schemas } from 'src/app.constants';
import { AttachmentDocument } from 'src/attachments/attachment.schema';
import { ObjectId } from 'bson';

export interface User {
  ethAddress: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  profileImage: AttachmentDocument | ObjectId;
}

export interface UserDocument extends User, Document { }

export const UserSchema = new Schema({
  ethAddress: { type: String, required: true, index: true},
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: false },
  profileImage: {type: Schema.Types.ObjectId, ref: Schemas.Attachment},
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

UserSchema.virtual('fullName').get(function() {
  return (this.firstName && this.lastName) ? this.firstName + ' ' + this.lastName : this.ethAddress;
});
