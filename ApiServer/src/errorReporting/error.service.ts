import { Injectable, Inject } from '@nestjs/common';
import { Schemas, Modules } from 'src/app.constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorDocument } from './error.schema';

@Injectable()
export class ErrorService {
  constructor(
    @Inject(Modules.Logger) logger,
    @InjectModel(Schemas.Error) private readonly errorRepository: Model<ErrorDocument>)
  {
  }

  async saveError(errorData: {errorMessage: String, reporterAddress: String}, networkId: number): Promise<ErrorDocument>{
    const errorDoc = await new this.errorRepository(errorData);
    errorDoc.networkId = networkId;
    errorDoc.save();
    return errorDoc.toObject();
  }
}
