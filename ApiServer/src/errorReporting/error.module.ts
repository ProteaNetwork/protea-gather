import { Module } from '@nestjs/common';
import { ErrorService } from './error.service';
import { ErrorController } from './error.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Schemas } from 'src/app.constants';
import { ErrorSchema } from './error.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Schemas.Error, schema: ErrorSchema}]),
  ],
  providers: [ErrorService],
  controllers: [ErrorController]
})
export class ErrorModule {}

