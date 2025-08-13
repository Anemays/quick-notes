import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Headers,
} from '@nestjs/common';
import { AuthService, RegisterDto } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionGuard } from './guards/session.guard';

interface AuthenticatedRequest extends Request {
  user: { id: number; email: string; name: string };
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: AuthenticatedRequest) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(SessionGuard)
  @Post('logout')
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
