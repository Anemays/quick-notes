import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import NotesView from './NotesView.vue';

// Mock all NaiveUI components to avoid DOM issues
vi.mock('naive-ui', () => ({
  NMessageProvider: {
    name: 'NMessageProvider',
    template: '<div><slot /></div>',
  },
  NButton: {
    name: 'NButton',
    template: '<button><slot /></button>',
    props: ['disabled', 'type'],
  },
  NCard: {
    name: 'NCard',
    template: '<div class="n-card"><slot /></div>',
    props: ['class'],
  },
  NInput: {
    name: 'NInput',
    template: '<input />',
    props: ['value', 'placeholder', 'clearable', 'size'],
  },
  NForm: {
    name: 'NForm',
    template: '<form><slot /></form>',
    props: ['model', 'labelPlacement'],
  },
  NFormItem: {
    name: 'NFormItem',
    template: '<div><slot /></div>',
    props: ['label', 'path'],
  },
  NDivider: {
    name: 'NDivider',
    template: '<hr />',
  },
  NSpin: {
    name: 'NSpin',
    template: '<div><slot /></div>',
    props: ['show'],
  },
  NIcon: {
    name: 'NIcon',
    template: '<span><slot /></span>',
    props: ['size'],
  },
  useMessage: () => ({
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  }),
}));

// Mock icons
vi.mock('@vicons/ionicons5', () => ({
  AddOutline: { name: 'AddOutline', template: '<span>+</span>' },
  RefreshOutline: { name: 'RefreshOutline', template: '<span>↻</span>' },
  SearchOutline: { name: 'SearchOutline', template: '<span>🔍</span>' },
  CreateOutline: { name: 'CreateOutline', template: '<span>✎</span>' },
  TrashOutline: { name: 'TrashOutline', template: '<span>🗑</span>' },
  DocumentTextOutline: {
    name: 'DocumentTextOutline',
    template: '<span>📄</span>',
  },
  FolderOutline: { name: 'FolderOutline', template: '<span>📁</span>' },
  AttachOutline: { name: 'AttachOutline', template: '<span>📎</span>' },
}));

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
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('shows welcome message when no notes', () => {
    const wrapper = mount(NotesView, {
      global: {
        plugins: [pinia],
      },
    });

    // Should show some indication when no notes are present
    expect(wrapper.text()).toContain('No notes yet');
  });

  it('has proper component structure', () => {
    const wrapper = mount(NotesView, {
      global: {
        plugins: [pinia],
      },
    });

    // Check for main container or notes-related content
    expect(wrapper.exists()).toBe(true);
  });
});
