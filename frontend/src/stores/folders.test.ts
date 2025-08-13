import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useFoldersStore } from './folders';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      put: vi.fn(),
      interceptors: {
        request: {
          use: vi.fn(),
        },
        response: {
          use: vi.fn(),
        },
      },
    })),
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    put: vi.fn(),
  },
}));

// Mock useAuthStore
vi.mock('./auth', () => ({
  useAuthStore: vi.fn(() => ({
    sessionId: null,
    user: null,
  })),
}));

describe('Folders Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should initialize with empty state', () => {
    const store = useFoldersStore();

    expect(store.folders).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBe(null);
  });

  it('should have sorted folders computed property', () => {
    const store = useFoldersStore();

    store.folders = [
      {
        id: 1,
        name: 'Z Folder',
        color: '#ff0000',
        userId: 1,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      },
      {
        id: 2,
        name: 'A Folder',
        color: '#00ff00',
        userId: 1,
        createdAt: '2023-01-02',
        updatedAt: '2023-01-02',
      },
    ];

    expect(store.sortedFolders).toEqual([
      {
        id: 2,
        name: 'A Folder',
        color: '#00ff00',
        userId: 1,
        createdAt: '2023-01-02',
        updatedAt: '2023-01-02',
      },
      {
        id: 1,
        name: 'Z Folder',
        color: '#ff0000',
        userId: 1,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      },
    ]);
  });

  it('should clear error', () => {
    const store = useFoldersStore();

    store.error = 'Some error';
    store.clearError();

    expect(store.error).toBe(null);
  });

  it('should reset store', () => {
    const store = useFoldersStore();

    store.folders = [
      {
        id: 1,
        name: 'Test',
        color: '#ff0000',
        userId: 1,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      },
    ];
    store.loading = true;
    store.error = 'Some error';

    store.reset();

    expect(store.folders).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBe(null);
  });

  it('should not fetch folders when no auth session', async () => {
    // Mock useAuthStore to return no sessionId
    const mockAuthStore = {
      sessionId: null,
      user: null,
    };

    vi.doMock('./auth', () => ({
      useAuthStore: () => mockAuthStore,
    }));

    const store = useFoldersStore();

    await store.fetchFolders();

    expect(store.folders).toEqual([]);
  });

  it('should not create folder when no auth session', async () => {
    // Mock useAuthStore to return no sessionId
    const mockAuthStore = {
      sessionId: null,
      user: null,
    };

    vi.doMock('./auth', () => ({
      useAuthStore: () => mockAuthStore,
    }));

    const store = useFoldersStore();

    const result = await store.createFolder({ name: 'Test Folder' });

    expect(result).toBe(null);
  });
});
