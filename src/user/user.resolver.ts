import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './schema/user.schema';
import { UserService } from './user.service';
import { UpdateUserInput } from './dto/update-user.input';
import { SuccessResponse } from '../utils/delete.envelope.response';
import { JwtAuthGuard } from '../guards/Jwt.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Mutation(() => User)
  async createUser(
    @Args('name') name: string,
    @Args('email') email: string,
  ): Promise<User> {
    return this.userService.createUser({ name, email });
  }

  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.userService.updateUser(updateUserInput);
  }

  @Mutation(() => SuccessResponse, { nullable: true })
  async deleteUser(
    @Args('id', { type: () => String }) id: Pick<User, 'id'>,
  ): Promise<SuccessResponse> {
    return this.userService.deleteUser(id);
  }
}
