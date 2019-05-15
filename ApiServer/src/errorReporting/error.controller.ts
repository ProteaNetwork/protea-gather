import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { ErrorService } from './error.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('error')
export class ErrorController {
  constructor(private readonly errorService: ErrorService){}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async saveError(@Body() bodyData){
    return await this.errorService.saveError(bodyData);
  }
}
