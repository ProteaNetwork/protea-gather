import { Injectable, Inject } from '@nestjs/common';
import { Schemas, Modules } from 'src/app.constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorDocument } from './error.schema';
import { ErrorDTO } from './dto/error.dto';

@Injectable()
export class ErrorService {
  constructor(
    @Inject(Modules.Logger) logger,
    @InjectModel(Schemas.Error) private readonly errorRepository: Model<ErrorDocument>)
  {
  }

  async saveError(errorData: ErrorDTO): Promise<ErrorDocument>{
    const errorDoc = await new this.errorRepository(errorData);
    errorDoc.save();
    return errorDoc.toObject();
  }
}
