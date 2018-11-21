import { Test } from '@nestjs/testing';

import {AuthController} from './auth.controller';
import { AuthService, LoginStatus, SignInDto, LoginResponse } from './auth.service';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import { UnauthorizedException } from '@nestjs/common';

describe('auth.controller', () => {
  const authService = {
    signIn(signInDto: SignInDto) {
      if (signInDto.email === 'correct@test.com' && signInDto.password === 'correct') {
        return {
          token: 'TOKEN',
          userId: 'test',
          status: 'SUCCESS',
        };
      } else {
        throw new UnauthorizedException('Email or password is invalid');
      }
    },
  };

  let authController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        WinstonModule.forRoot({
        transports: [
            new transports.Console({
                level: 'info',
                handleExceptions: false,
                format: format.combine(format.json()),
            }),
          ],
        }),
      ],
      providers: [{
        provide: AuthService,
        useValue: authService,
      }],
    }).compile();
    authController = module.get<AuthController>(AuthController);
  });

  describe('Sign-In', () => {
    it('Should return a token for valid user', async () => {

      const expected = { userId: 'test', status: LoginStatus.success, token: 'TOKEN' };

      expect(await AuthController.signIn({email:'correct@test.com', password: 'correct'})).toBe(expected)
    });
    // it('Should not sign in an invalid email', async () => {
    //   let result;
    //   try {
    //     await authService.signIn({
    //       email: 'wrong@test.com',
    //       password: 'correct',
    //     });
    //   } catch (error) {
    //     result = error;
    //   }
    //   expect(result).toHaveProperty('status');
    //   expect(result.status).toEqual(401);
    //   expect(result).toHaveProperty('message');
    //   expect(result.message.message).toBe('Invalid Username or Password');
    // });
    // it('Should not sign in an invalid password', async () => {
    //   let result;
    //   try {
    //     result = await authService.signIn({
    //       email: 'correct@test.com',
    //       password: 'wrong',
    //     });
    //   } catch (error) {
    //     result = error;
    //   }
    //   expect(result.status).toBe(401);
    //   expect(result.message.message).toBe('Invalid Username or Password');
    // });
  });
});
