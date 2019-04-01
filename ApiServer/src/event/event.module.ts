import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Schemas } from 'src/app.constants';
import { EventSchema } from './event.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Schemas.Event, schema: EventSchema}])],
  providers: [EventService],
  controllers: [EventController]
})
export class EventModule {}
