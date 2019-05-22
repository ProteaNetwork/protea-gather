import { Controller, Post, UseGuards, Body, Put, Get, NotFoundException, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EventService } from './event.service';
import { EventDTO } from './dto/event.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptorHelper, FileOptions } from 'src/helper/fileInterceptorHelper';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService){}

  @Get(':networkId/:eventId')
  async getEventMeta(@Param('eventId') eventId, @Param('networkId') networkId) {
    const event =  await this.eventService.getEventById(eventId, networkId);
    if(!event){
      throw(new NotFoundException)
    }
    return event;
  }


  @Post('/:networkId')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptorHelper(
    {
      name: 'bannerImage',
      maxCount: 1,
      type: FileOptions.PICTURE
    }
  ))
  async createEvent(@Body() bodyData: EventDTO, @Param('networkId') networkId, @UploadedFile() bannerImage){
    return await this.eventService.createEvent(bodyData, networkId, bannerImage);
  }

  @Put(':networkId/:eventId/update')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptorHelper(
    {
      name: 'bannerImage',
      maxCount: 1,
      type: FileOptions.PICTURE
    }
  ))
  async updateEvent(@Body() bodyData, @Param('networkId') networkId, @UploadedFile() bannerImage){
    return await this.eventService.updateEvent(bodyData, networkId, bannerImage);
  }
}
