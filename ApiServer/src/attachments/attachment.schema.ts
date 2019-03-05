import { Document } from 'mongoose';
import * as gridfs from 'mongoose-gridfs';

export interface Attachment {
  _id: any;
  length: number;
  chunkSize: number;
  uploadDate: Date;
  filename: string;
  md5: string;
  contentType: string;
  aliases: [any];
}

export interface AttachmentDocument extends Attachment, Document { }
