import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from './auth';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      post: vi.fn(),
      interceptors: {
        request: {
          use: vi.fn(),
        },
        response: {
          use: vi.fn(),
        },
      },
    })),
    post: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should initialize with empty state', () => {
    const store = useAuthStore();

    expect(store.sessionId).toBe(null);
    expect(store.user).toBe(null);
    expect(store.isLoading).toBe(false);
  });

  it('should check if user is authenticated', () => {
    const store = useAuthStore();

    // Not authenticated initially
    expect(store.isAuthenticated).toBe(false);

    // Set both sessionId and user (requirement for isAuthenticated)
    store.sessionId = 'test-session-id';
    store.user = {
      id: 1,
      email: 'test@test.com',
      name: 'Test User',
    };
    expect(store.isAuthenticated).toBe(true);
  });

  it('should restore session from localStorage on init', () => {
    const mockSessionId = 'test-session-id';
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      name: 'Test User',
    };

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'auth_sessionId') return mockSessionId;
      if (key === 'auth_user') return JSON.stringify(mockUser);
      return null;
    });

    const store = useAuthStore();

    // Call initializeAuth to restore from localStorage
    store.initializeAuth();

    expect(store.sessionId).toBe(mockSessionId);
    expect(store.user).toEqual(mockUser);
  });

  it('should handle localStorage errors gracefully', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });

    const store = useAuthStore();

    expect(store.sessionId).toBe(null);
    expect(store.user).toBe(null);
  });

  it('should clear authentication state on logout', async () => {
    // Mock globalThis.fetch untuk logout API call
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Logged out successfully' }),
    });

    const store = useAuthStore();

    // Set some state
    store.sessionId = 'test-session-id';
    store.user = {
      id: 1,
      email: 'test@test.com',
      name: 'Test User',
    };

    // Call logout
    await store.logout();

    expect(store.sessionId).toBe(null);
    expect(store.user).toBe(null);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_sessionId');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_user');
  });

  it('should set authentication state on login/register', () => {
    const store = useAuthStore();
    const mockSessionId = 'test-session-id';
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      name: 'Test User',
    };

    // Simulate setting auth state like login/register does
    store.sessionId = mockSessionId;
    store.user = mockUser;

    expect(store.sessionId).toBe(mockSessionId);
    expect(store.user).toEqual(mockUser);
    expect(store.isAuthenticated).toBe(true);
  });

  it('should have working initializeAuth method', () => {
    const store = useAuthStore();

    expect(typeof store.initializeAuth).toBe('function');

    // Should not throw when called
    expect(() => store.initializeAuth()).not.toThrow();
  });
});
