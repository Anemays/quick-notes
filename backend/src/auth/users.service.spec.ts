import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    createdAt: new Date(),
  };

  const mockSafeUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'new@example.com',
        password: 'password',
        name: 'New User',
      };

      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);

      (prismaService.user.create as jest.Mock).mockResolvedValue(mockSafeUser);

      const result = await service.create(createUserDto);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('password', 10);

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: 'hashedPassword',
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });
      expect(result).toEqual(mockSafeUser);
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
        mockSafeUser,
      );

      const result = await service.findById(1);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });
      expect(result).toEqual(mockSafeUser);
    });
  });

  describe('validatePassword', () => {
    it('should return true when password is valid', async () => {
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.validatePassword(
        'password',
        'hashedPassword',
      );

      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        'password',
        'hashedPassword',
      );
      expect(result).toBe(true);
    });

    it('should return false when password is invalid', async () => {
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await service.validatePassword(
        'wrongpassword',
        'hashedPassword',
      );

      expect(result).toBe(false);
    });
  });
});
