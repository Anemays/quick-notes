import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNotesStore } from './notes';
import axios from 'axios';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('axios');

describe('notes store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.resetAllMocks();
  });

  it('should fetch notes', async () => {
    const store = useNotesStore();
    const mockNotes = [{ id: 1, title: 'Test', content: 'Content' }];
    vi.mocked(axios.get).mockResolvedValueOnce({ data: mockNotes });

    await store.fetch();

    expect(store.notes).toEqual(mockNotes);
    expect(axios.get).toHaveBeenCalledWith('/api/notes');
  });

  it('should add a note without file', async () => {
    const store = useNotesStore();
    const mockNote = { id: 1, title: 'Test', content: 'Content' };
    vi.mocked(axios.post).mockResolvedValueOnce({ data: mockNote });

    await store.add('Test', 'Content');

    expect(axios.post).toHaveBeenCalledWith('/api/notes', {
      title: 'Test',
      content: 'Content',
    });
    expect(store.notes).toContainEqual(mockNote);
  });

  it('should add a note with file', async () => {
    const store = useNotesStore();
    const file = new File(['test'], 'test.txt');
    vi.mocked(axios.post).mockResolvedValueOnce({ data: {} });

    await store.add('Test', 'Content', file);

    const formDataCall = vi.mocked(axios.post).mock.calls[0];
    const [url, formData] = formDataCall;
    expect(url).toBe('/api/notes/upload');
    expect(formData instanceof FormData).toBe(true);
    const typedFormData = formData as FormData;
    expect(typedFormData.get('file')).toBe(file);
    expect(typedFormData.get('title')).toBe('Test');
    expect(typedFormData.get('content')).toBe('Content');
  });

  it('should update a note', async () => {
    const store = useNotesStore();
    const updatedNote = { id: 1, title: 'Updated', content: 'Content' };
    store.notes = [{ id: 1, title: 'Test', content: 'Content' }];
    vi.mocked(axios.patch).mockResolvedValueOnce({ data: updatedNote });

    await store.update(1, { title: 'Updated' });

    expect(store.notes[0]).toEqual(updatedNote);
    expect(axios.patch).toHaveBeenCalledWith('/api/notes/1', {
      title: 'Updated',
    });
  });

  it('should remove a note', async () => {
    const store = useNotesStore();
    store.notes = [{ id: 1, title: 'Test', content: 'Content' }];
    vi.mocked(axios.delete).mockResolvedValueOnce({});

    await store.remove(1);

    expect(store.notes.length).toBe(0);
    expect(axios.delete).toHaveBeenCalledWith('/api/notes/1');
  });
});
