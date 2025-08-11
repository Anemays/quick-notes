import { describe, it, expect, vi } from 'vitest';

// Mock dependencies before imports
const mockApp = {
  use: vi.fn().mockReturnThis(),
  mount: vi.fn(),
};

const mockPinia = { install: vi.fn() };
const mockRouter = { install: vi.fn() };
const mockNaiveUI = { install: vi.fn() };

vi.mock('vue', () => ({
  createApp: vi.fn(() => mockApp),
}));

vi.mock('pinia', () => ({
  createPinia: vi.fn(() => mockPinia),
  defineStore: vi.fn(),
}));

vi.mock('./router', () => ({
  default: mockRouter,
}));

vi.mock('./naive', () => ({
  createNaiveUI: vi.fn(() => mockNaiveUI),
}));

vi.mock('./App.vue', () => ({
  default: { name: 'App' },
}));

// Mock store modules
vi.mock('./stores/auth', () => ({
  useAuthStore: vi.fn(() => ({
    initializeAuth: vi.fn(),
  })),
}));

vi.mock('./stores/theme', () => ({
  useThemeStore: vi.fn(() => ({
    initializeTheme: vi.fn(),
  })),
}));

describe('main setup', () => {
  it('should setup the Vue application correctly', async () => {
    // Import main to trigger app initialization
    await import('./main');

    // Verify createApp was called
    const { createApp } = await import('vue');
    expect(createApp).toHaveBeenCalled();

    // Verify plugins are used
    expect(mockApp.use).toHaveBeenCalledWith(mockPinia);
    expect(mockApp.use).toHaveBeenCalledWith(mockRouter);
    expect(mockApp.use).toHaveBeenCalledWith(mockNaiveUI);

    // Verify app is mounted
    expect(mockApp.mount).toHaveBeenCalledWith('#app');
  });
});
