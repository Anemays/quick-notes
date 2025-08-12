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

  // Add request interceptor to include auth token
  api.interceptors.request.use((config) => {
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    console.log(
      '🌐 API Request:',
      config.method?.toUpperCase(),
      config.url,
      'Base:',
      config.baseURL,
    );
    return config;
  });

  // Computed
  const sortedFolders = computed(() => {
    return [...folders.value].sort((a, b) => a.name.localeCompare(b.name));
  });

  // Actions
  const fetchFolders = async () => {
    if (!authStore.token) {
      console.warn('⚠️ No auth token found, skipping fetchFolders');
      return;
    }

    console.log('📡 Fetching folders...');
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get('/folders');

      console.log('✅ Folders fetched:', response.data);
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
    if (!authStore.token) {
      console.error('❌ No auth token found');
      return null;
    }

    console.log('📡 Creating folder with data:', folderData);
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post('/folders', folderData);

      console.log('✅ Folder creation response:', response.data);
      const newFolder = response.data;
      folders.value.push(newFolder);
      console.log('📋 Updated folders array:', folders.value);
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
    if (!authStore.token) return null;

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
    if (!authStore.token) return false;

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
    if (!authStore.token) return false;

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
