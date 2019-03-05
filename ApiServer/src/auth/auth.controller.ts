import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService, SignInDto, LoginResponse } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async signIn(@Body() signInDto: SignInDto): Promise<LoginResponse> {
    // TODO Update the sign-in message to work with a signed message instead
    return this.authService.signIn(signInDto);
  }
}
