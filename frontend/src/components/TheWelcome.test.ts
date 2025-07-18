import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TheWelcome from './TheWelcome.vue';

// Mock all icon components
vi.mock('./icons/IconDocumentation.vue', () => ({
  default: { template: '<div class="icon-documentation"></div>' },
}));
vi.mock('./icons/IconTooling.vue', () => ({
  default: { template: '<div class="icon-tooling"></div>' },
}));
vi.mock('./icons/IconEcosystem.vue', () => ({
  default: { template: '<div class="icon-ecosystem"></div>' },
}));
vi.mock('./icons/IconCommunity.vue', () => ({
  default: { template: '<div class="icon-community"></div>' },
}));
vi.mock('./icons/IconSupport.vue', () => ({
  default: { template: '<div class="icon-support"></div>' },
}));

describe('TheWelcome', () => {
  it('renders all welcome items', () => {
    const wrapper = mount(TheWelcome);
    const items = wrapper.findAllComponents({ name: 'WelcomeItem' });

    // Should have 5 welcome items
    expect(items.length).toBe(5);
  });

  it('renders all icons', () => {
    const wrapper = mount(TheWelcome);

    expect(wrapper.find('.icon-documentation').exists()).toBe(true);
    expect(wrapper.find('.icon-tooling').exists()).toBe(true);
    expect(wrapper.find('.icon-ecosystem').exists()).toBe(true);
    expect(wrapper.find('.icon-community').exists()).toBe(true);
    expect(wrapper.find('.icon-support').exists()).toBe(true);
  });

  it('contains documentation link', () => {
    const wrapper = mount(TheWelcome);
    const docLink = wrapper.find('a[href="https://vuejs.org/"]');

    expect(docLink.exists()).toBe(true);
    expect(docLink.text()).toContain('official documentation');
  });
});
