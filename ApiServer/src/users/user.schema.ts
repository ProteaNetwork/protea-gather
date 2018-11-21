import {Schema, Document} from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface User {
  firstName: string;
  lastName: string;
  fullName: string;
  ensName: string;
  ethAddress: string;
}

export interface UserDocument extends User, Document { }

export const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    ensName: {type: String, required: true},
    ethAddress: {type: String, required: true},
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
    return this.firstName + ' ' + this.lastName;
});
