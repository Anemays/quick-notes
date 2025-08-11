<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { NConfigProvider, NMessageProvider } from 'naive-ui';
import { useRoute } from 'vue-router';
import AppLayout from './components/layouts/AppLayout.vue';
import { useThemeStore } from './stores/theme';
import { useAuthStore } from './stores/auth';
import { storeToRefs } from 'pinia';

const route = useRoute();
const themeStore = useThemeStore();
const authStore = useAuthStore();
const { naiveTheme, isDark } = storeToRefs(themeStore);

onMounted(() => {
  console.log('🚀 App mounted, initializing theme and auth...');
  themeStore.initializeTheme();
  authStore.initializeAuth();
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
  { immediate: true },
);
</script>

<template>
  <n-config-provider :theme="naiveTheme">
    <n-message-provider>
      <template v-if="route.name === 'login'">
        <RouterView />
      </template>
      <template v-else>
        <AppLayout>
          <RouterView />
        </AppLayout>
      </template>
    </n-message-provider>
  </n-config-provider>
</template>
