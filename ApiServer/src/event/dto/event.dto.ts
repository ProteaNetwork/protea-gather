import { IsString, IsDate, IsNumber } from 'class-validator';

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
  @IsDate() // TODO: fix FormData casting issue
  eventDate: Date;
  @IsNumber()
  networkId: number;
}
