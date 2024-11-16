import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key: string) => {
              if (key === 'HARDCODED_JWT') {
                return '005d993abaf74deaa290fe1814846d71f02e41fd6fccdf56106c30b13e8e4510';
              }
              throw new Error(`${key} not found`);
            }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const result = await authService.login();
      expect(result).toHaveProperty('accessToken');
      expect(result.accessToken).toBe(
        '005d993abaf74deaa290fe1814846d71f02e41fd6fccdf56106c30b13e8e4510',
      );
    });
  });
});
