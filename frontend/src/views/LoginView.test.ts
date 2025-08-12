import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import { NMessageProvider } from 'naive-ui';
import LoginView from './LoginView.vue';

// Mock useMessage
vi.mock('naive-ui', async () => {
  const actual = await vi.importActual('naive-ui');
  return {
    ...actual,
    useMessage: () => ({
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
    }),
  };
});

describe('LoginView', () => {
  let pinia: any;
  let router: any;

  beforeEach(() => {
    pinia = createPinia();
    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: { template: '<div>Home</div>' } }],
    });
  });

  it('renders correctly', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia, router],
        components: {
          NMessageProvider,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('shows login form', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia, router],
        components: {
          NMessageProvider,
        },
      },
    });

    // Should have login-related elements
    expect(
      wrapper.find('form').exists() || wrapper.find('.login').exists(),
    ).toBe(true);
  });

  it('has proper structure for authentication', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia, router],
        components: {
          NMessageProvider,
        },
      },
    });

    // Check for authentication UI elements
    const hasAuthElements =
      wrapper.text().includes('Login') ||
      wrapper.text().includes('Email') ||
      wrapper.text().includes('Password') ||
      wrapper.find('input').exists();
    expect(hasAuthElements).toBe(true);
  });
});
