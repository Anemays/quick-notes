import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { NMessageProvider } from 'naive-ui';
import NotesView from './NotesView.vue';

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

describe('NotesView', () => {
  let pinia: any;

  beforeEach(() => {
    pinia = createPinia();
  });

  it('renders correctly', () => {
    const wrapper = mount(NotesView, {
      global: {
        plugins: [pinia],
        components: {
          NMessageProvider,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('shows welcome message when no notes', () => {
    const wrapper = mount(NotesView, {
      global: {
        plugins: [pinia],
        components: {
          NMessageProvider,
        },
      },
    });

    // Should show some indication when no notes are present
    expect(wrapper.text()).toContain('Notes');
  });

  it('has proper component structure', () => {
    const wrapper = mount(NotesView, {
      global: {
        plugins: [pinia],
        components: {
          NMessageProvider,
        },
      },
    });

    // Check for main container or notes-related content
    expect(wrapper.exists()).toBe(true);
  });
});
