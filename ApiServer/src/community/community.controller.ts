import { Controller, Get, Req, Param, UseGuards, Put, Body, NotFoundException, Post, UseInterceptors, UploadedFile, UploadedFiles, FilesInterceptor } from '@nestjs/common';
import { CommunityService } from './community.service';
import { AuthGuard } from '@nestjs/passport';
import { CommunityDTO } from './dto/community.dto';
import {FileOptions, FileInterceptorHelper } from 'src/helper/fileInterceptorHelper';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService){}

  @Get(':networkId/:tbcAddress')
  async getCommunityMeta(@Param('tbcAddress') communityAddress, @Param('networkId') networkId) {
    const community =  await this.communityService.getCommunityByTbcAddress(communityAddress, networkId);
    if(!community){
      throw(new NotFoundException)
    }
    return community;
  }

  @Post("/:networkId")
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptorHelper(
    {
      name: 'bannerImage',
      maxCount: 1,
      type: FileOptions.PICTURE
    }
  ))
  async createCommunity(@Body() bodyData: CommunityDTO, @Param('networkId') networkId, @UploadedFile() bannerImage){
    return await this.communityService.createCommunity(bodyData, networkId, bannerImage);
  }

  @Put(':networkId/:tbcAddress/update')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptorHelper(
    {
      name: 'bannerImage',
      maxCount: 1,
      type: FileOptions.PICTURE
    }
  ))
  async updateCommunity(@Param('tbcAddress') tbcAddress, @Param('networkId') networkId, @Body() bodyData, @UploadedFile() bannerImage){
    return await this.communityService.updateCommunity(tbcAddress, networkId, bodyData, bannerImage);
  }
}
