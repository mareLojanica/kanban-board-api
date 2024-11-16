import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  async login(): Promise<{ accessToken: string }> {
    return {
      accessToken: this.configService.getOrThrow<string>('HARDCODED_JWT'),
    };
  }
}
