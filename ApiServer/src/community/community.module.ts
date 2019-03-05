import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';

@Module({
  providers: [CommunityService],
  controllers: [CommunityController]
})
export class CommunityModule {}
