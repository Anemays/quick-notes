import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth';

export interface Note {
  id: number;
  title: string;
  content: string;
  fileUrl?: string | null;
  folderId?: number | null;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
}

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: '/api',
});

// Add request interceptor to include session ID
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.sessionId) {
    config.headers['X-Session-ID'] = authStore.sessionId;
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      // Use router instead of window.location for SPA navigation
      import('@/router').then(({ default: router }) => {
        router.push('/login');
      });
    }
    return Promise.reject(error);
  },
);

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [] as Note[],
    loading: false,
    searchTerm: '',
  }),
  actions: {
    async fetch() {
      try {
        this.loading = true;
        const res = await api.get<Note[]>('/notes');
        this.notes = res.data || [];
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          // Treat 404 as empty list
          this.notes = [];
        } else {
          // Re-throw other errors
          throw error;
        }
      } finally {
        this.loading = false;
      }
    },
    async searchByTitle(searchTerm: string) {
      try {
        this.loading = true;
        this.searchTerm = searchTerm;
        const res = await api.get<Note[]>('/notes/search', {
          params: { q: searchTerm },
        });
        this.notes = res.data || [];
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          this.notes = [];
        } else {
          throw error;
        }
      } finally {
        this.loading = false;
      }
    },
    clearSearch() {
      this.searchTerm = '';
      this.fetch();
    },
    async add(title: string, content: string, f?: File) {
      if (!title.trim()) return;
      try {
        if (f) {
          const form = new FormData();
          form.append('title', title);
          form.append('content', content);
          form.append('file', f);
          const res = await api.post<Note>('/notes/upload', form);
          if (res.data) {
            this.notes.push(res.data);
          }
        } else {
          const res = await api.post<Note>('/notes', { title, content });
          if (res.data) {
            this.notes.push(res.data);
          }
        }
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 404) {
          // Re-throw errors other than 404
          throw error;
        }
      }
    },
    async update(id: number, data: Partial<Note>) {
      const res = await api.patch<Note>(`/notes/${id}`, data);
      const idx = this.notes.findIndex((n) => n.id === id);
      if (idx !== -1) this.notes[idx] = res.data;
    },
    async remove(id: number) {
      await api.delete(`/notes/${id}`);
      this.notes = this.notes.filter((n) => n.id !== id);
    },
    async moveToFolder(noteId: number, folderId: number | null) {
      const res = await api.patch<Note>(`/notes/${noteId}`, { folderId });
      const idx = this.notes.findIndex((n) => n.id === noteId);
      if (idx !== -1) {
        this.notes[idx] = res.data;
      }
      return res.data;
    },
  },
});
