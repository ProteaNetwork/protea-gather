import Express from 'express';
import { Controller, UseGuards, Req, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async getUserProfile(@Req() request: Express.Request & { user: User }) {
    return {
      displayName: request.user.fullName || request.user.ethAddress,
      profileImage: request.user.profileImage,
    };
  }
}
