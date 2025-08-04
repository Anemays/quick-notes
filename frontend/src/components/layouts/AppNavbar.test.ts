import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
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
    const wrapper = mount(AppNavbar, {
      global: {
        plugins: [pinia],
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-test="theme-toggle"]').exists()).toBe(true);
  });
});
