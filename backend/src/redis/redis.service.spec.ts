import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

const mockRedisInstance = {
  on: jest.fn(),
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn(),
  setex: jest.fn().mockResolvedValue('OK'),
  get: jest.fn(),
  del: jest.fn().mockResolvedValue(1),
  keys: jest.fn(),
  expire: jest.fn().mockResolvedValue(1),
};

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => mockRedisInstance);
});

describe('RedisService', () => {
  let service: RedisService;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn((key: string) => {
        switch (key) {
          case 'REDIS_HOST':
            return 'localhost';
          case 'REDIS_PORT':
            return 6379;
          case 'REDIS_PASSWORD':
            return undefined;
          default:
            return undefined;
        }
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize Redis connection on module init', async () => {
    await service.onModuleInit();

    expect(mockRedisInstance.on).toHaveBeenCalledWith(
      'connect',
      expect.any(Function),
    );
    expect(mockRedisInstance.on).toHaveBeenCalledWith(
      'error',
      expect.any(Function),
    );
    expect(mockRedisInstance.connect).toHaveBeenCalled();
  });

  it('should set session with default TTL', async () => {
    const sessionId = 'test-session-123';
    const userData = {
      userId: 1,
      email: 'test@example.com',
    };

    await service.onModuleInit();
    await service.setSession(sessionId, userData);

    expect(mockRedisInstance.setex).toHaveBeenCalledWith(
      `session:${sessionId}`,
      86400,
      JSON.stringify(userData),
    );
  });

  it('should get session data when session exists', async () => {
    const sessionId = 'test-session-123';
    const userData = {
      userId: 1,
      email: 'test@example.com',
    };

    await service.onModuleInit();
    mockRedisInstance.get.mockResolvedValue(JSON.stringify(userData));

    const result = await service.getSession(sessionId);

    expect(mockRedisInstance.get).toHaveBeenCalledWith(`session:${sessionId}`);
    expect(result).toEqual(userData);
  });

  it('should return null when session does not exist', async () => {
    const sessionId = 'test-session-123';

    await service.onModuleInit();
    mockRedisInstance.get.mockResolvedValue(null);

    const result = await service.getSession(sessionId);

    expect(result).toBeNull();
  });

  it('should delete session', async () => {
    const sessionId = 'test-session-123';

    await service.onModuleInit();
    await service.deleteSession(sessionId);

    expect(mockRedisInstance.del).toHaveBeenCalledWith(`session:${sessionId}`);
  });

  it('should extend session with default TTL', async () => {
    const sessionId = 'test-session-123';

    await service.onModuleInit();
    await service.extendSession(sessionId);

    expect(mockRedisInstance.expire).toHaveBeenCalledWith(
      `session:${sessionId}`,
      86400,
    );
  });

  it('should disconnect on module destroy', async () => {
    await service.onModuleInit();
    service.onModuleDestroy();

    expect(mockRedisInstance.disconnect).toHaveBeenCalled();
  });
});
