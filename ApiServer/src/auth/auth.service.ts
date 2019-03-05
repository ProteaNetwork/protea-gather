import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException, NotImplementedException } from '@nestjs/common';
import { UsersService } from '../user/user.service';

export interface JwtPayload {
  userId: string;
  // TODO: Add Role or permissions here
}

export interface SignInDto {
  email: string;
  password: string;
}

export enum LoginStatus {
  success = 'SUCCESS',
}

export interface LoginResponse {
  token: string;
  userId: string;
  status: LoginStatus;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  // TODO Update the sign-in message to work with a signed message instead
  async signIn({ email, password }: SignInDto): Promise<LoginResponse> {
    throw new NotImplementedException();
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    throw new NotImplementedException();
  }
}
