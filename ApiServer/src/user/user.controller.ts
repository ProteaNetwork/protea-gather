import Express from 'express';
import { Controller, UseGuards, Req, Get, Put, NotFoundException, UseInterceptors, Body, UploadedFile, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.schema';
import { FileInterceptorHelper, FileOptions } from 'src/helper/fileInterceptorHelper';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('/:ethAddress')
  @UseGuards(AuthGuard('jwt'))
  async getUserProfile(@Param('ethAddress') ethAddress, @Req() request: Express.Request & { user: User }) {
    const user = await this.userService.getUserByEthAddress(ethAddress);
    if(!user){
      throw(new NotFoundException)
    }
    user.displayName = user.displayName != "" ? user.displayName : user.ethAddress;
    return user;
  }

  @Put('/')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptorHelper(
    {
      name: 'profileImage',
      maxCount: 1,
      type: FileOptions.PICTURE
    }
  ))
  async setUserProfile(@Body() bodyData, @UploadedFile() profileImage) {
    const user = await this.userService.updateUserProfile(bodyData, profileImage);
    if(!user){
      throw(new NotFoundException)
    }
    return user;
  }
}
