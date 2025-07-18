import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useCounterStore } from './counter';

describe('counter store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with count 0', () => {
    const store = useCounterStore();
    expect(store.count).toBe(0);
  });

  it('should increment count', () => {
    const store = useCounterStore();
    store.count = 0;
    store.increment();
    expect(store.count).toBe(1);
  });

  it('should compute double count', () => {
    const store = useCounterStore();
    store.count = 2;
    expect(store.doubleCount).toBe(4);
  });
});
