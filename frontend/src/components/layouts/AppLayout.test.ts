import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import AppLayout from './AppLayout.vue';

// Mock the child components
vi.mock('./AppSidebar.vue', () => ({
  default: {
    template: '<div data-test="sidebar"></div>',
  },
}));

vi.mock('./AppNavbar.vue', () => ({
  default: {
    template: '<div data-test="navbar"></div>',
  },
}));

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      component: { template: '<div>Home</div>' },
    },
  ],
});

describe('AppLayout', () => {
  it('renders all layout components', async () => {
    const wrapper = mount(AppLayout, {
      global: {
        plugins: [router],
      },
    });

    await router.isReady();

    expect(wrapper.find('[data-test="sidebar"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="navbar"]').exists()).toBe(true);
  });

  it('toggles sidebar collapse state', async () => {
    const wrapper = mount(AppLayout, {
      global: {
        plugins: [router],
      },
    });

    await router.isReady();

    const sidebar = wrapper.find('[data-test="sidebar"]');

    // Check if sidebar receives the correct collapsed prop
    expect(sidebar.attributes('collapsed')).toBe('true');

    // Simulate toggle event from sidebar
    await sidebar.trigger('toggle');
    expect(sidebar.attributes('collapsed')).toBe('false');

    // Toggle again
    await sidebar.trigger('toggle');
    expect(sidebar.attributes('collapsed')).toBe('true');
  });
});
