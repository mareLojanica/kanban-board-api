import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UpdateUserInput } from './dto/update-user.input';
import { SuccessResponse } from '../utils/delete.envelope.response';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let service: UserService;

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
  };

  const mockSuccessResponse: SuccessResponse = { success: true };

  const mockUserService = {
    getUsers: jest.fn().mockResolvedValue([mockUser]),
    createUser: jest.fn().mockResolvedValue(mockUser),
    updateUser: jest.fn().mockResolvedValue(mockUser),
    deleteUser: jest.fn().mockResolvedValue(mockSuccessResponse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return a list of users', async () => {
      const result = await resolver.getUsers();

      expect(service.getUsers).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const name = 'Test User';
      const email = 'test@example.com';

      const result = await resolver.createUser(name, email);

      expect(service.createUser).toHaveBeenCalledWith({ name, email });
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const updateUserInput: UpdateUserInput = {
        id: '1',
        name: 'Updated User',
      };

      const result = await resolver.updateUser(updateUserInput);

      expect(service.updateUser).toHaveBeenCalledWith(updateUserInput);
      expect(result).toEqual(mockUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const userId = { id: '1' };

      const result = await resolver.deleteUser(userId);

      expect(service.deleteUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockSuccessResponse);
    });
  });
});
