import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  LoginResponseDto,
  LogoutResponseDto,
  RegisterResponseDto,
} from './dto/response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionGuard } from './guards/session.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
  user: { id: number; email: string; name: string };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login user with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Request() req: AuthenticatedRequest) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or email already exists',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(SessionGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout current user session' })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID to logout',
    required: false,
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Authorization header with Session token',
    required: false,
    example: 'Session abc123-def456-ghi789',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out',
    type: LogoutResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing session',
  })
  async logout(
    @Headers('x-session-id') sessionId: string,
    @Headers('authorization') authHeader: string,
  ) {
    let finalSessionId = sessionId;

    if (!finalSessionId && authHeader && authHeader.startsWith('Session ')) {
      finalSessionId = authHeader.substring(8);
    }

    if (finalSessionId) {
      await this.authService.logout(finalSessionId);
    }

    return { message: 'Logged out successfully' };
  }
}
