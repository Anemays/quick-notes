import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import App from './App.vue';

// Mock browser APIs
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
});

// Create a minimal router instance
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: { template: '<div>Home</div>' },
    },
  ],
});

// Mock the layout components
vi.mock('./components/layouts/AppLayout.vue', () => ({
  default: {
    template: `
      <div data-test="app-layout">
        <div data-test="sidebar"></div>
        <div data-test="main">
          <div data-test="navbar"></div>
          <router-view></router-view>
        </div>
      </div>
    `,
  },
}));

describe('App', () => {
  it('renders properly with layout', async () => {
    const pinia = createPinia();
    const wrapper = mount(App, {
      global: {
        plugins: [router, pinia],
      },
    });

    // Wait for router to be ready
    await router.isReady();

    expect(wrapper.html()).toContain('data-test="app-layout"');
  });
});
