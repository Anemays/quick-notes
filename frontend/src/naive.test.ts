import { describe, it, expect, vi } from 'vitest';
import { createNaiveUI } from './naive';

// Mock all Naive UI components and functions
vi.mock('naive-ui', () => ({
  // Basic components
  NButton: { name: 'NButton' },
  NCard: { name: 'NCard' },
  NInput: { name: 'NInput' },
  NForm: { name: 'NForm' },
  NFormItem: { name: 'NFormItem' },
  NSpace: { name: 'NSpace' },
  NLayout: { name: 'NLayout' },
  NLayoutHeader: { name: 'NLayoutHeader' },
  NLayoutSider: { name: 'NLayoutSider' },
  NLayoutContent: { name: 'NLayoutContent' },
  NLayoutFooter: { name: 'NLayoutFooter' },
  NMenu: { name: 'NMenu' },
  NConfigProvider: { name: 'NConfigProvider' },

  // Notification and message
  NNotificationProvider: { name: 'NNotificationProvider' },
  NMessageProvider: { name: 'NMessageProvider' },
  NDialogProvider: { name: 'NDialogProvider' },

  // Advanced components
  NUpload: { name: 'NUpload' },
  NUploadDragger: { name: 'NUploadDragger' },
  NModal: { name: 'NModal' },
  NSelect: { name: 'NSelect' },
  NOption: { name: 'NOption' },
  NCheckbox: { name: 'NCheckbox' },
  NRadio: { name: 'NRadio' },
  NDatePicker: { name: 'NDatePicker' },
  NTimePicker: { name: 'NTimePicker' },
  NSlider: { name: 'NSlider' },
  NSwitch: { name: 'NSwitch' },
  NRate: { name: 'NRate' },
  NColorPicker: { name: 'NColorPicker' },
  NCascader: { name: 'NCascader' },
  NTransfer: { name: 'NTransfer' },
  NTree: { name: 'NTree' },
  NTable: { name: 'NTable' },
  NPagination: { name: 'NPagination' },
  NList: { name: 'NList' },
  NListItem: { name: 'NListItem' },
  NDescriptions: { name: 'NDescriptions' },
  NDescriptionsItem: { name: 'NDescriptionsItem' },

  // Theme and styling
  darkTheme: { name: 'darkTheme' },
  lightTheme: { name: 'lightTheme' },

  // Functions
  useOsTheme: vi.fn(() => ({ value: 'light' })),
  useThemeVars: vi.fn(() => ({})),
  useDialog: vi.fn(() => ({
    warning: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
  })),
  useMessage: vi.fn(() => ({
    info: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  })),
  useNotification: vi.fn(() => ({
    create: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  })),

  // Create mock for all components as functions
  create: vi.fn(() => ({
    NButton: { name: 'NButton' },
    NCard: { name: 'NCard' },
    // ... all other components
  })),
}));

describe('naive ui setup', () => {
  it('should create naive ui instance with components', () => {
    const result = createNaiveUI();

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });
});
