import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ThemeToggle from './ThemeToggle.vue';

// Mock browser APIs
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
});

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

describe('ThemeToggle', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('renders properly', () => {
    const wrapper = mount(ThemeToggle);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('shows moon icon in light mode', () => {
    const wrapper = mount(ThemeToggle);
    // Check for moon icon path signature
    expect(wrapper.html()).toContain('M160 136c0-30.62');
  });

  it('toggles theme when clicked', async () => {
    const wrapper = mount(ThemeToggle);
    const button = wrapper.find('button');

    await button.trigger('click');
    // Check for sun icon path signature
    expect(wrapper.html()).toContain('M256 48v48');
  });
});
