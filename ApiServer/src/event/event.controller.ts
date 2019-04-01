import { Controller, Post, UseGuards, Body, Put, Get, NotFoundException, Param } from '@nestjs/common';
import { EventService } from './event.service';
import { EventDTO } from './dto/event.dto';
import { AuthGuard } from '@nestjs/passport';

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
  async createEvent(@Body() bodyData: EventDTO){

  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  async updateEvent(@Body() bodyData: EventDTO){

  }
}
