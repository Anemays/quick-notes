import { describe, it, expect, vi } from 'vitest';
import { createNaiveUI } from './naive';
import { create } from 'naive-ui';

vi.mock('naive-ui', () => ({
  create: vi.fn(),
  NButton: {},
  NInput: {},
  NLayout: {},
  NLayoutContent: {},
  NLayoutHeader: {},
  NLayoutFooter: {},
  NCard: {},
  NForm: {},
  NFormItem: {},
  NMessageProvider: {},
  NNotificationProvider: {},
  NDialogProvider: {},
}));

describe('naive ui setup', () => {
  it('should create naive ui instance with components', () => {
    vi.mocked(create).mockReturnValue({} as any);

    createNaiveUI();

    expect(create).toHaveBeenCalledWith({
      components: expect.arrayContaining([
        expect.any(Object), // NButton
        expect.any(Object), // NInput
        expect.any(Object), // etc...
      ]),
    });
  });
});
