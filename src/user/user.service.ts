import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ApolloError } from 'apollo-server-express';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { SuccessResponse } from '../utils/delete.envelope.response';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser({ email, name }: CreateUserInput) {
    try {
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw new ApolloError(
          'User with this email already exists',
          'USER_EXISTS',
        );
      }

      const user = this.userModel.create({ name, email });

      return user;
    } catch (error) {
      throw new ApolloError('Failed to create user', 'CREATE_USER_ERROR', {
        details: error.message,
      });
    }
  }

  async getUsers() {
    try {
      // maybe handle getting data with some pagination
      return await this.userModel.find().exec();
    } catch (error) {
      throw new ApolloError('Failed to fetch users', 'FETCH_USERS_ERROR', {
        details: error.message,
      });
    }
  }

  async updateUser({ id, name, email }: UpdateUserInput) {
    try {
      const existingUser = await this.userModel.findById(id);
      if (!existingUser) {
        throw new ApolloError('User not found', 'USER_NOT_FOUND');
      }
      if (name) existingUser.name = name;
      if (email) existingUser.email = email;

      return await existingUser.save();
    } catch (error) {
      throw new ApolloError('Failed to update user', 'FETCH_USERS_ERROR', {
        details: error.message,
      });
    }
  }

  async deleteUser(id: Pick<User, 'id'>): Promise<SuccessResponse> {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id);
      if (!deletedUser) {
        throw new ApolloError('User not found', 'USER_NOT_FOUND');
      }
      return { success: true };
    } catch (error) {
      throw new ApolloError('Failed to delete user', 'DELETE_USER_ERROR', {
        details: error.message,
      });
    }
  }
}
