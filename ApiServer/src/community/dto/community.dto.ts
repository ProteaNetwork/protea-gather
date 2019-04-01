import { IsString, IsEmail, MinLength } from 'class-validator';

export class CommunityDTO {
  @IsString()
  tbcAddress: string;
  @IsString()
  membershipManager: string;
  @IsString()
  eventsManager: string;
  @IsString()
  name: string;
  @IsString()
  tokenSymbol: string;
  @IsString()
  Description: string;
  @IsString()
  tags: string;
}
