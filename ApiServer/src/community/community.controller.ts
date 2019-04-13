import { Controller, Get, Req, Param, UseGuards, Put, Body, NotFoundException, Post, UseInterceptors, UploadedFile, UploadedFiles, FilesInterceptor } from '@nestjs/common';
import { CommunityService } from './community.service';
import { AuthGuard } from '@nestjs/passport';
import { CommunityDTO } from './dto/community.dto';
import {FileOptions, FileInterceptorHelper } from 'src/helper/fileInterceptorHelper';

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
  @UseInterceptors(FileInterceptorHelper(
    {
      name: 'bannerImage',
      maxCount: 1,
      type: FileOptions.PICTURE
    }
  ))
  async createCommunity(@Body() bodyData: CommunityDTO, @UploadedFile() bannerImage){
    return await this.communityService.createCommunity(bodyData, bannerImage);
  }

  @Put(':tbcAddress/update')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptorHelper(
    {
      name: 'bannerImage',
      maxCount: 1,
      type: FileOptions.PICTURE
    }
  ))
  async updateCommunity(@Param('tbcAddress') tbcAddress, @Body() bodyData, @UploadedFile() bannerImage){
    return await this.communityService.updateCommunity(tbcAddress, bodyData, bannerImage);
  }
}
