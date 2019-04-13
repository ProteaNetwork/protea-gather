import { Controller, Post, UseGuards, Body, Put, Get, NotFoundException, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EventService } from './event.service';
import { EventDTO } from './dto/event.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptorHelper, FileOptions } from 'src/helper/fileInterceptorHelper';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService){}

  @Get(':eventId')
  async getCommunityMeta(@Param('eventId') eventId) {
    const event =  await this.eventService.getEventById(eventId);
    if(!event){
      throw(new NotFoundException)
    }
    return event;
  }


  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptorHelper(
    {
      name: 'bannerImage',
      maxCount: 1,
      type: FileOptions.PICTURE
    }
  ))
  async createEvent(@Body() bodyData: EventDTO, @UploadedFile() bannerImage){
    return await this.eventService.createEvent(bodyData, bannerImage);
  }

  @Put(':eventId/update')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptorHelper(
    {
      name: 'bannerImage',
      maxCount: 1,
      type: FileOptions.PICTURE
    }
  ))
  async updateEvent(@Body() bodyData, @UploadedFile() bannerImage){
    return await this.eventService.updateEvent(bodyData, bannerImage);
  }
}
