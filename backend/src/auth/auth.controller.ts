import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService, RegisterDto } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

interface AuthenticatedRequest extends Request {
  user: { id: number; email: string; name: string };
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: AuthenticatedRequest) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
