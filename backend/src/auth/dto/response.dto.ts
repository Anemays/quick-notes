import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Session ID for authentication',
    example: 'abc123-def456-ghi789',
  })
  sessionId: string;

  @ApiProperty({
    description: 'User information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      email: { type: 'string', example: 'user@example.com' },
      name: { type: 'string', example: 'John Doe' },
    },
  })
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export class LogoutResponseDto {
  @ApiProperty({
    description: 'Logout success message',
    example: 'Logged out successfully',
  })
  message: string;
}

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Registration success message',
    example: 'User registered successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Created user information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      email: { type: 'string', example: 'user@example.com' },
      name: { type: 'string', example: 'John Doe' },
    },
  })
  user: {
    id: number;
    email: string;
    name: string;
  };
}
