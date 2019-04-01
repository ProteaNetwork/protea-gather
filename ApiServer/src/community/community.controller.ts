import { Controller, Get, Req, Param, UseGuards, Put, Body, NotFoundException, Post } from '@nestjs/common';
import { CommunityService } from './community.service';
import { AuthGuard } from '@nestjs/passport';
import { CommunityDTO } from './dto/community.dto';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService){}

  @Get(':tbcAddress')
  async getCommunityMeta(@Param('tbcAddress') communityAddress) {
    const community =  await this.communityService.getCommunityByTbcAddress(communityAddress);
    if(!community){
      throw(new NotFoundException)
    }
    return community;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createCommunity(@Body() bodyData: CommunityDTO){
    return await this.communityService.createCommunity(bodyData);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  async updateCommunity(@Body() bodyData: CommunityDTO){
    return await this.communityService.updateCommunity(bodyData);
  }
}
