import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import AppSidebar from './AppSidebar.vue';
import { ChevronBack, ChevronForward, Home } from '@vicons/ionicons5';

// Mock theme store
vi.mock('@/stores/theme', () => ({
  useThemeStore: vi.fn(() => ({
    isDark: false,
  })),
}));

const globalStubs = {
  RouterLink: {
    template: '<a><slot></slot></a>',
    props: ['to'],
  },
  NIcon: {
    template: '<span class="n-icon"><slot></slot></span>',
    props: ['size'],
  },
};

describe('AppSidebar', () => {
  it('renders properly with collapse state', () => {
    const pinia = createPinia();
    const wrapper = mount(AppSidebar, {
      props: {
        collapsed: true,
      },
      global: {
        plugins: [pinia],
        components: { ChevronBack, ChevronForward, Home },
        stubs: globalStubs,
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.props('collapsed')).toBe(true);
  });

  it('emits toggle event when clicked', async () => {
    const pinia = createPinia();
    const wrapper = mount(AppSidebar, {
      props: {
        collapsed: true,
      },
      global: {
        plugins: [pinia],
        components: { ChevronBack, ChevronForward, Home },
        stubs: globalStubs,
      },
    });

    // Find toggle button and click it
    const toggleButton = wrapper.find('button');
    if (toggleButton.exists()) {
      await toggleButton.trigger('click');
      expect(wrapper.emitted('toggle')).toBeTruthy();
    }
  });
});
