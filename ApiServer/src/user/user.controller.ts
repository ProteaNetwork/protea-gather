import Express from 'express';
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDTO) {
    await this.userService.create(createUserDto);
    return {result: 'created'};
  }
}
