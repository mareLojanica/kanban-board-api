import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtResponse } from './dto/jwt-response.dto';

describe('AuthResolver', () => {
  let authResolver: AuthResolver;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authResolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authResolver).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT response', async () => {
      const mockJwtResponse: JwtResponse = {
        accessToken: 'mockedAccessToken',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(mockJwtResponse);

      const result = await authResolver.login();

      expect(result).toEqual(mockJwtResponse);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if AuthService.login fails', async () => {
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new Error('Login failed'));

      await expect(authResolver.login()).rejects.toThrow('Login failed');
      expect(authService.login).toHaveBeenCalledTimes(1);
    });
  });
});
