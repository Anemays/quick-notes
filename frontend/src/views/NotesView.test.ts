import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import NotesView from './NotesView.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useNotesStore } from '../stores/notes';
import axios from 'axios';

vi.mock('axios');

// Mock NaiveUI components
const naiveUIComponents = {
  'n-message-provider': {
    template: '<div><slot></slot></div>',
  },
  'n-card': {
    template:
      '<div class="n-card"><div v-if="$slots.header" class="n-card-header"><slot name="header"></slot></div><slot></slot></div>',
  },
  'n-form': {
    template: '<form class="n-form"><slot></slot></form>',
    props: ['label-placement'],
  },
  'n-form-item': {
    template:
      '<div class="n-form-item"><label v-if="label" class="n-form-item-label">{{ label }}</label><div class="n-form-item-content"><slot></slot></div></div>',
    props: ['label'],
  },
  'n-input': {
    template:
      '<div class="n-input"><input :value="value" @input="$emit(\'update:value\', $event.target.value)" :type="type === \'textarea\' ? \'textarea\' : \'text\'" :rows="rows" :placeholder="placeholder" /></div>',
    props: ['value', 'type', 'rows', 'placeholder'],
    emits: ['update:value'],
  },
  'n-upload': {
    template: '<div class="n-upload"><slot></slot></div>',
    props: ['default-upload', 'on-change', 'accept'],
  },
  'n-button': {
    template:
      "<button :class=\"['n-button', type === 'primary' ? 'n-button--primary' : '', ghost ? 'n-button--ghost' : '']\" :disabled=\"disabled\" @click=\"$emit('click')\"><slot></slot></button>",
    props: {
      disabled: { type: Boolean, default: false },
      type: { type: String, default: 'default' },
      ghost: { type: Boolean, default: false },
    },
    emits: ['click'],
  },
  'n-divider': {
    template: '<hr class="n-divider" />',
  },
  'n-spin': {
    template: '<div class="n-spin"><slot></slot></div>',
    props: ['size'],
  },
};

describe('NotesView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.resetAllMocks();
  });

  it('renders properly', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({ data: [] });

    const wrapper = mount(NotesView, {
      global: {
        stubs: naiveUIComponents,
        plugins: [createPinia()],
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.exists()).toBe(true);
    expect(
      wrapper.find('input[placeholder="Enter a short title"]').exists(),
    ).toBe(true);
    expect(axios.get).toHaveBeenCalledWith('/api/notes');
  });

  it('enables add button only when title is not empty', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({ data: [] });

    const wrapper = mount(NotesView, {
      global: {
        stubs: naiveUIComponents,
        plugins: [createPinia()],
      },
    });

    await wrapper.vm.$nextTick();

    const addButton = wrapper.find('.n-button--primary');
    expect(addButton.exists()).toBe(true);
    expect(addButton.attributes('disabled')).toBeDefined();

    // Set title
    const titleInput = wrapper.find('input[placeholder="Enter a short title"]');
    await titleInput.setValue('Test Note');
    await wrapper.vm.$nextTick();
    expect(addButton.attributes('disabled')).toBeUndefined();

    // Clear title
    await titleInput.setValue('');
    await wrapper.vm.$nextTick();
    expect(addButton.attributes('disabled')).toBeDefined();
  });

  it('handles file upload and submission', async () => {
    const mockNote = { id: 1, title: 'Test', content: 'test content' };

    // Setup all mocks before mounting the component
    vi.mocked(axios.get).mockResolvedValueOnce({ data: [] });
    vi.mocked(axios.post).mockImplementationOnce(async (url, data) => {
      // Verify it's a file upload request
      expect(url).toBe('/api/notes/upload');
      expect(data instanceof FormData).toBe(true);
      return { data: mockNote };
    });

    // Create a fresh pinia instance and get store before mounting
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useNotesStore();

    const wrapper = mount(NotesView, {
      global: {
        stubs: naiveUIComponents,
        plugins: [pinia], // Use the same pinia instance
      },
    });

    // Wait for initial fetch
    await flushPromises();
    expect(store.notes).toEqual([]);

    const testFile = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });
    const title = 'Test Title';
    const content = 'Test Content';

    // Set form values
    const titleInput = wrapper.find('input[placeholder="Enter a short title"]');
    const contentInput = wrapper.find('input[type="textarea"]');
    await titleInput.setValue(title);
    await contentInput.setValue(content);

    // Handle file upload using native file input
    const vm = wrapper.vm as any;

    // Mock file input change event
    const mockEvent = {
      target: {
        files: [testFile],
      },
    } as any;

    await vm.onFileChange(mockEvent);
    await flushPromises();

    // Click add button and wait for submission
    await wrapper.find('.n-button--primary').trigger('click');
    await flushPromises();

    // Verify the form data was sent correctly
    const calls = vi.mocked(axios.post).mock.calls;
    expect(calls.length).toBe(1);
    const formData = calls[0][1] as FormData;
    expect(formData.get('file')).toBe(testFile);
    expect(formData.get('title')).toBe(title);
    expect(formData.get('content')).toBe(content);

    // After the API call succeeds, the store should be updated
    expect(store.notes).toEqual([mockNote]);
  });

  it('adds a new note when button is clicked', async () => {
    const mockNote = { id: 1, title: 'Test Note', content: 'Test Content' };

    // Setup all mocks before mounting the component
    vi.mocked(axios.get).mockResolvedValueOnce({ data: [] });
    vi.mocked(axios.post).mockImplementationOnce(async (url, data) => {
      // Verify it's a regular note addition
      expect(url).toBe('/api/notes');
      expect(data).toEqual({
        title: 'Test Note',
        content: 'Test Content',
      });
      return { data: mockNote };
    });

    // Create a fresh pinia instance and get store before mounting
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useNotesStore();

    const wrapper = mount(NotesView, {
      global: {
        stubs: naiveUIComponents,
        plugins: [pinia], // Use the same pinia instance
      },
    });

    // Wait for initial fetch
    await flushPromises();
    expect(store.notes).toEqual([]);

    // Set form values
    const titleInput = wrapper.find('input[placeholder="Enter a short title"]');
    const contentInput = wrapper.find('input[type="textarea"]');
    await titleInput.setValue('Test Note');
    await contentInput.setValue('Test Content');

    // Click add button and wait for all promises to resolve
    await wrapper.find('.n-button--primary').trigger('click');
    await flushPromises();

    // After the API call succeeds, the store should be updated
    expect(store.notes).toEqual([mockNote]);
  });

  it('renders search input correctly', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({ data: [] });

    const wrapper = mount(NotesView, {
      global: {
        stubs: naiveUIComponents,
        plugins: [createPinia()],
      },
    });

    await wrapper.vm.$nextTick();

    const searchInput = wrapper.find(
      'input[placeholder="Search notes by title..."]',
    );
    expect(searchInput.exists()).toBe(true);
  });

  it('handles search input and calls search with debounce', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({ data: [] });
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: [{ id: 1, title: 'JavaScript Guide', content: 'Content' }],
    });

    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useNotesStore();
    const searchSpy = vi.spyOn(store, 'searchByTitle');

    const wrapper = mount(NotesView, {
      global: {
        stubs: naiveUIComponents,
        plugins: [pinia],
      },
    });

    await flushPromises();

    const searchInput = wrapper.find(
      'input[placeholder="Search notes by title..."]',
    );
    await searchInput.setValue('JavaScript');
    await searchInput.trigger('input');

    // Wait for debounce (300ms) + a bit more
    await new Promise((resolve) => setTimeout(resolve, 350));
    await flushPromises();

    expect(searchSpy).toHaveBeenCalledWith('JavaScript');
  });

  it('clears search when clear button is clicked', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({ data: [] });
    vi.mocked(axios.get).mockResolvedValueOnce({ data: [] }); // for clearSearch

    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useNotesStore();
    store.searchTerm = 'JavaScript'; // Set initial search term
    const clearSearchSpy = vi.spyOn(store, 'clearSearch');

    const wrapper = mount(NotesView, {
      global: {
        stubs: naiveUIComponents,
        plugins: [pinia],
      },
    });

    await flushPromises();

    // Find the clear button by text content
    const buttons = wrapper.findAll('button');
    const clearButton = buttons.find((button) =>
      button.text().includes('Clear'),
    );
    expect(clearButton).toBeDefined();

    await clearButton!.trigger('click');
    await flushPromises();

    expect(clearSearchSpy).toHaveBeenCalled();
  });

  it('displays search results correctly', async () => {
    const searchResults = [
      { id: 1, title: 'JavaScript Guide', content: 'JavaScript content' },
      { id: 2, title: 'JS Advanced', content: 'Advanced content' },
    ];

    vi.mocked(axios.get).mockResolvedValueOnce({ data: searchResults });

    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useNotesStore();
    store.searchTerm = 'JavaScript';

    const wrapper = mount(NotesView, {
      global: {
        stubs: naiveUIComponents,
        plugins: [pinia],
      },
    });

    await flushPromises();

    // Check that search term is displayed
    expect(wrapper.text()).toContain('Searching for: "JavaScript"');

    // Check that search results are displayed
    expect(wrapper.text()).toContain('JavaScript Guide');
    expect(wrapper.text()).toContain('JS Advanced');
  });

  it('shows no results message when search returns empty', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({ data: [] });

    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useNotesStore();
    store.searchTerm = 'NonExistent';

    const wrapper = mount(NotesView, {
      global: {
        stubs: naiveUIComponents,
        plugins: [pinia],
      },
    });

    await flushPromises();

    expect(wrapper.text()).toContain('No notes found for "NonExistent"');
  });
});
