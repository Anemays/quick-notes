import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

interface RequestWithUser extends Request {
  user?: any;
}

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const sessionId = this.extractSessionId(request);

    if (!sessionId) {
      throw new UnauthorizedException('No session ID provided');
    }

    try {
      const user = await this.authService.validateSession(sessionId);
      if (!user) {
        throw new UnauthorizedException('Invalid session');
      }

      // Attach user to request object
      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Session validation failed');
    }
  }

  private extractSessionId(request: RequestWithUser): string | undefined {
    // Check for session ID in headers
    const sessionHeader = request.headers['x-session-id'] as string;
    if (sessionHeader) {
      return sessionHeader;
    }

    // Check for session ID in Authorization header (Bearer format)
    const authHeader = request.headers.authorization;
    if (
      authHeader &&
      typeof authHeader === 'string' &&
      authHeader.startsWith('Session ')
    ) {
      return authHeader.substring(8);
    }

    return undefined;
  }
}
