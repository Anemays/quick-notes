<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { NConfigProvider } from 'naive-ui';
import AppLayout from './components/layouts/AppLayout.vue';
import { useThemeStore } from './stores/theme';
import { storeToRefs } from 'pinia';

const themeStore = useThemeStore();
const { naiveTheme, isDark } = storeToRefs(themeStore);

onMounted(() => {
  console.log('🚀 App mounted, initializing theme...');
  themeStore.initializeTheme();
});

// Watch for theme changes and update document class
watch(
  isDark,
  (newValue) => {
    console.log('👀 Theme changed in App.vue, isDark:', newValue);
    if (typeof document !== 'undefined') {
      if (newValue) {
        document.documentElement.classList.add('dark');
        console.log('🌙 Added dark class to document');
      } else {
        document.documentElement.classList.remove('dark');
        console.log('☀️ Removed dark class from document');
      }
    }
  },
  { immediate: true }
);
</script>

<template>
  <NConfigProvider :theme="naiveTheme">
    <AppLayout />
  </NConfigProvider>
</template>
