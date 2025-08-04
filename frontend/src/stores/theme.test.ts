import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useThemeStore } from './theme';

// Mock browser APIs
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};

const mockDocumentElement = {
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
  },
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
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

Object.defineProperty(globalThis, 'document', {
  value: {
    documentElement: mockDocumentElement,
  },
});

describe('ThemeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with light theme by default', () => {
    const store = useThemeStore();
    expect(store.isDark).toBe(false);
    expect(store.naiveTheme).toBe(null);
  });

  it('toggles theme correctly', () => {
    const store = useThemeStore();
    expect(store.isDark).toBe(false);

    store.toggleTheme();
    expect(store.isDark).toBe(true);

    store.toggleTheme();
    expect(store.isDark).toBe(false);
  });

  it('sets theme correctly', () => {
    const store = useThemeStore();

    store.setTheme(true);
    expect(store.isDark).toBe(true);

    store.setTheme(false);
    expect(store.isDark).toBe(false);
  });

  it('initializes from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');

    const store = useThemeStore();
    store.initializeTheme();

    expect(store.isDark).toBe(true);
  });

  it('saves to localStorage when theme changes', () => {
    const store = useThemeStore();

    store.toggleTheme();

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });
});
