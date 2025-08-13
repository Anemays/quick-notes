/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockSafeUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
  };

  const mockAuthResult = {
    sessionId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' as const,
    user: mockSafeUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const req = { user: { userId: 1, email: 'test@example.com' } } as any;

      authService.login.mockResolvedValue(mockAuthResult);

      const result = await controller.login(req);
      expect(result).toEqual(mockAuthResult);
      expect(authService.login).toHaveBeenCalledWith(req.user);
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = {
        email: 'new@example.com',
        password: 'password',
        name: 'New User',
      };

      authService.register.mockResolvedValue(mockAuthResult);

      const result = await controller.register(registerDto);

      expect(result).toEqual(mockAuthResult);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });
});
