import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthResponse {
  sessionId: string;
  user: User;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const sessionId = ref<string | null>(null);
  const isLoading = ref(false);

  // Computed
  const isAuthenticated = computed(() => !!user.value && !!sessionId.value);

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
      sessionId.value = data.sessionId;

      // Save to localStorage
      localStorage.setItem('auth_sessionId', data.sessionId);
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
      sessionId.value = data.sessionId;

      // Save to localStorage
      localStorage.setItem('auth_sessionId', data.sessionId);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      // Call logout API if session exists
      if (sessionId.value) {
        await fetch('/auth/logout', {
          method: 'POST',
          headers: {
            'X-Session-ID': sessionId.value,
          },
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API fails
    }

    // Clear local state
    user.value = null;
    sessionId.value = null;

    // Remove from localStorage
    localStorage.removeItem('auth_sessionId');
    localStorage.removeItem('auth_user');
  };

  const initializeAuth = () => {
    const savedSessionId = localStorage.getItem('auth_sessionId');
    const savedUser = localStorage.getItem('auth_user');

    if (savedSessionId && savedUser) {
      try {
        sessionId.value = savedSessionId;
        user.value = JSON.parse(savedUser);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        logout();
      }
    }
  };

  return {
    user,
    sessionId,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    initializeAuth,
  };
});
