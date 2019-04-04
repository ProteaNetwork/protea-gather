import * as gridfs from 'mongoose-gridfs';
import * as streamifier from 'streamifier';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { Modules, Schemas } from 'src/app.constants';
import { InjectConnection } from '@nestjs/mongoose';
import { Mongoose, Model } from 'mongoose';
import { Attachment, AttachmentDocument } from './attachment.schema';
import { ObjectId } from 'bson';
import { Stream } from 'stream';

@Injectable()
export class AttachmentService {
  private readonly attachmentGridFsRepository: any; // This is used to access the binary data in the files
  private readonly attachmentRepository: Model<AttachmentDocument>; // This is used to access file metadata

  constructor(@InjectConnection() private readonly mongooseConnection: Mongoose,
              @Inject(Modules.Logger) private readonly logger: Logger) {
    this.attachmentGridFsRepository = gridfs({
      collection: 'attachments',
      model: Schemas.Attachment,
      mongooseConnection: this.mongooseConnection,
    });

    this.attachmentRepository = this.attachmentGridFsRepository.model;
  }

  async create(options: { filename: string, contentType: string }, file: { buffer: Buffer }): Promise<AttachmentDocument> {
    const fileStream = streamifier.createReadStream(file.buffer);
    const result = new Promise<AttachmentDocument>((resolve, reject) => {
      this.attachmentGridFsRepository.write(options, fileStream, (error, fileDocument: AttachmentDocument) => {
        resolve(fileDocument);
        reject(error);
      });
    });
    return await result;
  }

  async getFile(attachmentId: string): Promise<Buffer> {
    // TODO: Check file metadata to ensure that memory usage does not skyrocket if trying to return a big file
    try {
      const result = new Promise<Buffer>((resolve, reject) => {
        this.attachmentGridFsRepository.readById(new ObjectId(attachmentId), (error: Error, content: Buffer) => {
          resolve(content);
          reject(error);
        });
      });

      return result;
    } catch (e) {
      this.logger.log('error', e);
    }
  }

  getFileStream(attachmentId: string): Stream {
    const readStream = this.attachmentGridFsRepository.readById(new ObjectId(attachmentId)) as Stream;
    return readStream;
  }

  async getFileContentType(attachmentId: string): Promise<string> {
    const result = await this.attachmentRepository.findById(attachmentId, 'contentType', { lean: true });
    return result.contentType;
  }

  async delete(attachmentId: string): Promise<boolean> {
    const result = new Promise<boolean>((resolve, reject) => {
      this.attachmentGridFsRepository.unlinkById(new ObjectId(attachmentId), (error, unlinkedAttachment) => {
        resolve(true);
        reject(false);
      });
    });

    return await result;
  }
}
