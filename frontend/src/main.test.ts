import { describe, it, expect, vi } from 'vitest';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import { createNaiveUI } from './naive';
import App from './App.vue';

// Mock dependencies
const mockApp = {
  use: vi.fn().mockReturnThis(),
  mount: vi.fn(),
};

vi.mock('vue', () => ({
  createApp: vi.fn(() => mockApp),
}));

vi.mock('pinia', () => ({
  createPinia: vi.fn(),
}));

vi.mock('./router', () => ({
  default: {},
}));

vi.mock('./naive', () => ({
  createNaiveUI: vi.fn(),
}));

vi.mock('./App.vue', () => ({
  default: {},
}));

describe('main setup', () => {
  it('should setup the Vue application correctly', async () => {
    // Import main to trigger app initialization
    await import('./main');

    // Verify createApp was called with App component
    expect(createApp).toHaveBeenCalledWith(App);

    // Verify plugins are used
    expect(mockApp.use).toHaveBeenCalledWith(createPinia());
    expect(mockApp.use).toHaveBeenCalledWith(router);
    expect(mockApp.use).toHaveBeenCalledWith(createNaiveUI());

    // Verify app is mounted
    expect(mockApp.mount).toHaveBeenCalledWith('#app');
  });
});
