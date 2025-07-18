import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';

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
    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    });

    // Wait for router to be ready
    await router.isReady();

    expect(wrapper.html()).toContain('data-test="app-layout"');
  });
});
