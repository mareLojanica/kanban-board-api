import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { ApolloError } from 'apollo-server-express';

describe('UserService', () => {
  let service: UserService;
  let model: any;

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    save: jest.fn().mockResolvedValue({
      id: '1',
      name: 'Updated User',
      email: 'test@example.com',
    }),
  };

  const mockUserModel = {
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserInput = { name: 'Test User', email: 'test@example.com' };
      mockUserModel.findOne.mockResolvedValueOnce(null);
      mockUserModel.create.mockResolvedValueOnce(mockUser);

      const result = await service.createUser(createUserInput);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: createUserInput.email,
      });
      expect(mockUserModel.create).toHaveBeenCalledWith(createUserInput);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user with email already exists', async () => {
      const createUserInput = { name: 'Test User', email: 'test@example.com' };
      mockUserModel.findOne.mockResolvedValueOnce(mockUser);

      await expect(service.createUser(createUserInput)).rejects.toThrow(
        ApolloError,
      );
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: createUserInput.email,
      });
    });
  });

  describe('getUsers', () => {
    it('should return a list of users', async () => {
      mockUserModel.exec.mockResolvedValueOnce([mockUser]);

      const result = await service.getUsers();

      expect(mockUserModel.find).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });

    it('should throw an error if fetching users fails', async () => {
      mockUserModel.exec.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.getUsers()).rejects.toThrow(ApolloError);
      expect(mockUserModel.find).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const updateUserInput = {
        id: '1',
        name: 'Updated User',
      };

      mockUserModel.findById.mockResolvedValueOnce(mockUser);

      const result = await service.updateUser(updateUserInput);

      expect(mockUserModel.findById).toHaveBeenCalledWith(updateUserInput.id);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: '1',
        name: 'Updated User',
        email: 'test@example.com',
      });
    });

    it('should throw an error if user is not found', async () => {
      const updateUserInput = { id: '1', name: 'Updated User' };
      mockUserModel.findById.mockResolvedValueOnce(null);

      await expect(service.updateUser(updateUserInput)).rejects.toThrow(
        ApolloError,
      );
      expect(mockUserModel.findById).toHaveBeenCalledWith(updateUserInput.id);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      mockUserModel.findByIdAndDelete.mockResolvedValueOnce(mockUser);

      const result = await service.deleteUser({
        id: '6737a9a912ff9aee9901c991',
      });

      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith({
        id: '6737a9a912ff9aee9901c991',
      });
      expect(result).toEqual({ success: true });
    });

    it('should throw an error if user is not found', async () => {
      mockUserModel.findByIdAndDelete.mockResolvedValueOnce(null);

      await expect(service.deleteUser({ id: '1' })).rejects.toThrow(
        ApolloError,
      );
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith({ id: '1' });
    });
  });
});
