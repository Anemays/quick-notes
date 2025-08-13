import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from './auth';

export interface Folder {
  id: number;
  name: string;
  color: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
  notes?: Array<{
    id: number;
    title: string;
  }>;
  _count?: {
    notes: number;
  };
}

export interface CreateFolderDto {
  name: string;
  color?: string;
}

export interface UpdateFolderDto {
  name?: string;
  color?: string;
}

export const useFoldersStore = defineStore('folders', () => {
  const folders = ref<Folder[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const authStore = useAuthStore();

  // Create axios instance with consistent configuration
  const api = axios.create({
    baseURL: '/api',
  });

  // Add request interceptor to include session ID
  api.interceptors.request.use((config) => {
    if (authStore.sessionId) {
      config.headers['X-Session-ID'] = authStore.sessionId;
    }
    return config;
  });

  // Computed
  const sortedFolders = computed(() => {
    return [...folders.value].sort((a, b) => a.name.localeCompare(b.name));
  });

  // Actions
  const fetchFolders = async () => {
    if (!authStore.sessionId) {
      return;
    }

    loading.value = true;
    try {
      const response = await api.get('/folders');
      folders.value = response.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      error.value =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to fetch folders';
      console.error('❌ Error fetching folders:', errorMessage, err);
    } finally {
      loading.value = false;
    }
  };

  const createFolder = async (folderData: CreateFolderDto) => {
    if (!authStore.sessionId) {
      console.error('❌ No auth session found');
      return null;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await api.post('/folders', folderData);

      const newFolder = response.data;
      folders.value.push(newFolder);
      return newFolder;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      error.value =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to create folder';
      console.error('❌ Error creating folder:', errorMessage, err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateFolder = async (id: number, folderData: UpdateFolderDto) => {
    if (!authStore.sessionId) return null;

    loading.value = true;
    error.value = null;

    try {
      const response = await api.patch(`/folders/${id}`, folderData);

      const updatedFolder = response.data;
      const index = folders.value.findIndex((f) => f.id === id);
      if (index !== -1) {
        folders.value[index] = updatedFolder;
      }
      return updatedFolder;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      error.value =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to update folder';
      console.error('Error updating folder:', errorMessage);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteFolder = async (id: number) => {
    if (!authStore.sessionId) return false;

    loading.value = true;
    error.value = null;

    try {
      await api.delete(`/folders/${id}`);

      folders.value = folders.value.filter((f) => f.id !== id);
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      error.value =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to delete folder';
      console.error('Error deleting folder:', errorMessage);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const moveNoteToFolder = async (noteId: number, folderId: number | null) => {
    if (!authStore.sessionId) return false;

    loading.value = true;
    error.value = null;

    try {
      await api.put(`/folders/notes/${noteId}/move`, {
        folderId,
      });

      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      error.value =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to move note';
      console.error('Error moving note:', errorMessage);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const reset = () => {
    folders.value = [];
    loading.value = false;
    error.value = null;
  };

  return {
    // State
    folders,
    loading,
    error,

    // Computed
    sortedFolders,

    // Actions
    fetchFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    moveNoteToFolder,
    clearError,
    reset,
  };
});
