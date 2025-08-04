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
    console.log('🔄 Theme toggled, new value:', isDark.value);
    saveToStorage();
  };

  // Set specific theme
  const setTheme = (dark: boolean) => {
    isDark.value = dark;
    console.log('🎯 Theme set to:', dark);
    saveToStorage();
  };

  // Save to localStorage
  const saveToStorage = () => {
    if (typeof localStorage !== 'undefined') {
      const theme = isDark.value ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      console.log('💾 Saved theme to localStorage:', theme);
    }
  };

  // Initialize theme from localStorage or system preference
  const initializeTheme = () => {
    console.log('🎨 Theme initialization started');
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      console.log('💾 Saved theme from localStorage:', savedTheme);
      
      if (savedTheme) {
        isDark.value = savedTheme === 'dark';
      } else {
        // Force light mode as default
        console.log('🌞 No saved theme, setting default light mode');
        isDark.value = false;
      }
      
      console.log('🎭 Final isDark value after initialization:', isDark.value);
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
