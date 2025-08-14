import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { RedisService } from '../redis/redis.service';
import { randomUUID } from 'crypto';
import { RegisterDto } from './dto/register.dto';

interface UserPayload {
  id: number;
  email: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserPayload | null> {
    const user = await this.usersService.findByEmail(email);
    if (
      user &&
      (await this.usersService.validatePassword(password, user.password))
    ) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    }
    return null;
  }

  async login(user: UserPayload) {
    // Generate session ID instead of JWT
    const sessionId = randomUUID();

    // Store session in Redis
    await this.redisService.setSession(sessionId, {
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      sessionId,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    // Create new user
    const user = await this.usersService.create(registerDto);

    // Generate session ID instead of JWT
    const sessionId = randomUUID();

    // Store session in Redis
    await this.redisService.setSession(sessionId, {
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      sessionId,
      user,
    };
  }

  async logout(sessionId: string): Promise<void> {
    await this.redisService.deleteSession(sessionId);
  }

  async validateSession(sessionId: string): Promise<UserPayload | null> {
    const sessionData = await this.redisService.getSession(sessionId);
    if (!sessionData) {
      return null;
    }

    return {
      id: sessionData.userId,
      email: sessionData.email,
      name: (sessionData.name as string) || '',
    };
  }

  async logoutAllSessions(userId: number): Promise<void> {
    await this.redisService.deleteAllUserSessions(userId);
  }
}
