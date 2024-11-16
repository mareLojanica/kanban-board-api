import { Resolver, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { JwtResponse } from './dto/jwt-response.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => JwtResponse)
  async login(): Promise<JwtResponse> {
    return this.authService.login();
  }
}
