import { IsString, IsDate } from 'class-validator';

export class EventDTO {
  @IsString()
  eventId: string;
  @IsString()
  eventManagerAddress: string;
  @IsString()
  organizer: string;
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString() // TODO: fix FormData casting issue
  eventDate: Date;
}
