import { IsString, IsDate } from 'class-validator';

export class EventDTO {
  @IsString()
  eventId: string;
  @IsString()
  eventManagerAddress: string;
  @IsString()
  organizer: string;
  @IsString() // TODO: fix FormData casting issue
  maxAttendees: number;
  @IsString() // TODO: fix FormData casting issue
  requiredDai: number
  @IsString() // TODO: fix FormData casting issue
  state: number;
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString() // TODO: fix FormData casting issue
  eventDate: Date;
}
