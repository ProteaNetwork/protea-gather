import { Controller, Post, UseGuards, Body, Param } from '@nestjs/common';
import { ErrorService } from './error.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('error')
export class ErrorController {
  constructor(private readonly errorService: ErrorService){}

  @Post('/:networkId')
  @UseGuards(AuthGuard('jwt'))
  async saveError(@Body() bodyData: {errorMessage: String, reporterAddress: String}, @Param('networkId') networkId: number){
    return await this.errorService.saveError(bodyData, networkId);
  }
}
