import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

// Simple test without complex axios mocking
describe('notes store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should have basic store structure', async () => {
    // Dynamic import to avoid immediate axios initialization
    const { useNotesStore } = await import('./notes');
    const store = useNotesStore();

    // Test that store exists and has expected structure
    expect(store).toBeDefined();
    expect(store).toHaveProperty('notes');
    expect(store).toHaveProperty('loading');
    expect(store).toHaveProperty('searchTerm');
  });

  it('should handle search state management', async () => {
    const { useNotesStore } = await import('./notes');
    const store = useNotesStore();

    // Test search functionality that doesn't require API
    expect(typeof store.clearSearch).toBe('function');
    expect(typeof store.searchByTitle).toBe('function');
  });
});
