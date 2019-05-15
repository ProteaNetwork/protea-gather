import { IsString, IsNumber } from 'class-validator';

export class CommunityDTO {
  @IsString()
  tbcAddress: string;
  @IsString()
  membershipManagerAddress: string;
  @IsString()
  eventManagerAddress: string;
  @IsString()
  name: string;
  @IsString()
  tokenSymbol: string;
  @IsString()
  description: string;
  @IsNumber()
  gradientDenominator: number;
  @IsNumber()
  contributionRate: number;
}
