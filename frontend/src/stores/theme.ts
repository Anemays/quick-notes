import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { darkTheme } from 'naive-ui';

export const useThemeStore = defineStore('theme', () => {
  // Force light mode as initial state
  const isDark = ref(false);

  // Computed untuk NaiveUI theme
  const naiveTheme = computed(() => (isDark.value ? darkTheme : null));

  // Toggle theme function
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    saveToStorage();
  };

  // Set specific theme
  const setTheme = (dark: boolean) => {
    isDark.value = dark;
    saveToStorage();
  };

  // Save to localStorage
  const saveToStorage = () => {
    if (typeof localStorage !== 'undefined') {
      const theme = isDark.value ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
    }
  };

  // Initialize theme from localStorage or system preference
  const initializeTheme = () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');

      if (savedTheme) {
        isDark.value = savedTheme === 'dark';
      } else {
        // Force light mode as default
        isDark.value = false;
      }
    }
  };

  return {
    isDark,
    naiveTheme,
    toggleTheme,
    setTheme,
    initializeTheme,
  };
});
