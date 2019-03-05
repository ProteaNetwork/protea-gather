import 'jest';
import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';

import { AuthService, LoginStatus, SignInDto, LoginResponse } from './auth.service';
import { AuthController } from './auth.controller';

describe('auth.controller', () => {
  let authController: AuthController;

  const mockAuthService = { };

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
      providers: [AuthController, {
        provide: AuthService,
        useValue: mockAuthService,
      }],
    }).compile();
    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('Sign-In', () => {
    // it('Should return a token for valid user', async () => {

    //   const expected = { userId: 'test', status: LoginStatus.success, token: 'TOKEN' } as LoginResponse;

    //   const result = await authController.signIn({ email: 'correct@test.com', password: 'correct' });
    //   expect(result).toEqual(expected);
    // });

    // it('Should not sign in an invalid email', async () => {
    //   let result;
    //   try {
    //     await authController.signIn({
    //       email: 'wrong@test.com',
    //       password: 'correct',
    //     });
    //   } catch (error) {
    //     result = error;
    //   }
    //   expect(result).toHaveProperty('status');
    //   expect(result.status).toEqual(401);
    //   expect(result).toHaveProperty('message');
    //   expect(result.message.message).toBe('Email or password is invalid');
    // });

    // it('Should not sign in an invalid password', async () => {
    //   let result;
    //   try {
    //     result = await authController.signIn({
    //       email: 'correct@test.com',
    //       password: 'wrong',
    //     });
    //   } catch (error) {
    //     result = error;
    //   }
    //   expect(result.status).toBe(401);
    //   expect(result.message.message).toEqual('Email or password is invalid');
    // });
  });
});
