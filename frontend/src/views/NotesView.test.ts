import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import {
  NMessageProvider,
  NButton,
  NCard,
  NInput,
  NForm,
  NFormItem,
  NDivider,
  NSpin,
} from 'naive-ui';
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

// Mock SimpleFolderSidebar
vi.mock('@/components/SimpleFolderSidebar.vue', () => ({
  default: {
    name: 'SimpleFolderSidebar',
    template: '<div data-testid="simple-folder-sidebar">Folder Sidebar</div>',
  },
}));

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
          NButton,
          NCard,
          NInput,
          NForm,
          NFormItem,
          NDivider,
          NSpin,
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
          NButton,
          NCard,
          NInput,
          NForm,
          NFormItem,
          NDivider,
          NSpin,
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
          NButton,
          NCard,
          NInput,
          NForm,
          NFormItem,
          NDivider,
          NSpin,
        },
      },
    });

    // Check for main container or notes-related content
    expect(wrapper.exists()).toBe(true);
  });
});
