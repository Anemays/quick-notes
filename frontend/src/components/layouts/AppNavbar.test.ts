import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import AppNavbar from './AppNavbar.vue';

// Mock ThemeToggle component
vi.mock('../ThemeToggle.vue', () => ({
  default: {
    name: 'ThemeToggle',
    template: '<button data-test="theme-toggle">Toggle</button>',
  },
}));

describe('AppNavbar', () => {
  it('renders properly', () => {
    const pinia = createPinia();
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/login', component: { template: '<div>Login</div>' } },
        { path: '/notes', component: { template: '<div>Notes</div>' } },
      ],
    });

    const wrapper = mount(AppNavbar, {
      global: {
        plugins: [pinia, router],
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-test="theme-toggle"]').exists()).toBe(true);
  });
});
