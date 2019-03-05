import {Schema, Document} from 'mongoose';

export interface User {
  firstName: string;
  lastName: string;
  fullName(): string;
  email: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UserDocument extends User, Document { }

export const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, select: false},
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
