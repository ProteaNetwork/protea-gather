import { IsString, IsEmail, MinLength, IsNumber, IsDate, IsArray } from 'class-validator';

export class EventDTO {
  @IsString()
  eventId: string;
  @IsString()
  eventManagerAddress: string;
  @IsString()
  organizer: string;

  @IsArray()
  attendees: string[];

  @IsNumber()
  maxAttendees: number;
  @IsNumber()
  requiredDai: number
  @IsNumber()
  state: number;

  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsDate()
  date: Date;
}
