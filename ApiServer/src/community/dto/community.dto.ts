import { IsString } from 'class-validator';

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
  @IsString()
  gradientDenominator: number;
  @IsString()
  contributionRate: number;
}
