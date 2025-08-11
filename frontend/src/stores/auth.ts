import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthResponse {
  access_token: string;
  user: User;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);

  // Computed
  const isAuthenticated = computed(() => !!user.value && !!token.value);

  // Actions
  const login = async (email: string, password: string): Promise<void> => {
    try {
      isLoading.value = true;

      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data: AuthResponse = await response.json();

      user.value = data.user;
      token.value = data.access_token;

      // Save to localStorage
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
  ): Promise<void> => {
    try {
      isLoading.value = true;

      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data: AuthResponse = await response.json();

      user.value = data.user;
      token.value = data.access_token;

      // Save to localStorage
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;

    // Remove from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const initializeAuth = () => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');

    if (savedToken && savedUser) {
      try {
        token.value = savedToken;
        user.value = JSON.parse(savedUser);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        logout();
      }
    }
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    initializeAuth,
  };
});
