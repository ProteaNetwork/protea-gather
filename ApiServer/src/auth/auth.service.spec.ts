import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { AuthService, LoginStatus } from './auth.service';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';

describe('auth.service', () => {
  const usersService = {
    findByEmail(email) {
      if (email === 'correct@test.com') {
        return {
          id: 'test',
          firstName: 'testFirst',
          lastName: 'testLast',
          comparePassword(password: string) {
            const correctPassword = 'correct';
            if (correctPassword === password) {
              return true;
            } else {
              return false;
            }
        },
      };
    } else {
        return undefined;
      }
    },
  };
  
  const jwtService = {
    sign(tokenPayload) {
      return 'TOKEN';
    },
  };

  let authService: AuthService;

  beforeAll(async () => {
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
      providers: [AuthService, {
        provide: JwtService,
        useValue: jwtService,
      }, {
        provide: UsersService,
        useValue: usersService,
      }],
    }).compile();
    authService = module.get<AuthService>(AuthService);
  });

  describe('Sign-In', () => {
    it('Should sign in a valid user', async () => {
      const response = await authService.signIn({
        email: 'correct@test.com',
        password: 'correct',
      });

      const expected = { userId: 'test', status: LoginStatus.success };

      expect(response).toHaveProperty('userId');
      expect(response).toHaveProperty('token');
      expect(response).toHaveProperty('status');
      expect(response.userId).toBe(expected.userId);
      expect(response.status).toBe(expected.status);
    });
    it('Should not sign in an invalid email', async () => {
      let result;
      try {
        await authService.signIn({
          email: 'wrong@test.com',
          password: 'correct',
        });
      } catch (error) {
        result = error;
      }
      expect(result).toHaveProperty('status');
      expect(result.status).toEqual(401);
      expect(result).toHaveProperty('message');
      expect(result.message.message).toBe('Invalid Username or Password');
    });
    it('Should not sign in an invalid password', async () => {
      let result;
      try {
        result = await authService.signIn({
          email: 'correct@test.com',
          password: 'wrong',
        });
      } catch (error) {
        result = error;
      }
      expect(result.status).toBe(401);
      expect(result.message.message).toBe('Invalid Username or Password');
    });
  });
});
