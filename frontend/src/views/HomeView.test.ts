import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import HomeView from './HomeView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';

// Mock theme store
vi.mock('@/stores/theme', () => ({
  useThemeStore: vi.fn(() => ({
    isDark: false,
    toggleTheme: vi.fn(),
  })),
}));

const mockRouter = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/notes', component: { template: '<div>Notes</div>' } },
  ],
});

describe('HomeView', () => {
  it('renders properly', async () => {
    const pinia = createPinia();
    const wrapper = mount(HomeView, {
      global: {
        plugins: [mockRouter, pinia],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain('Quick Notes');
    expect(wrapper.text()).toContain('Simple. Fast. Organized.');
    expect(wrapper.text()).toContain('Create Notes');
    expect(wrapper.text()).toContain('Dark Mode');
    expect(wrapper.text()).toContain('Get Started');
  });
});
