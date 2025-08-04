<template>
  <div
    :class="[
      'flex h-screen overflow-hidden transition-colors',
      themeStore.isDark ? 'bg-gray-900' : 'bg-gray-50'
    ]"
  >
    <!-- Sidebar -->
    <AppSidebar :collapsed="collapsed" @toggle="collapsed = !collapsed" />

    <!-- Main Area -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Top Navbar -->
      <AppNavbar />

      <!-- Page Content with scroll -->
      <main
        :class="[
          'flex-1 overflow-y-auto p-6 transition-colors',
          themeStore.isDark ? 'bg-gray-900' : 'bg-gray-50'
        ]"
      >
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useThemeStore } from '@/stores/theme';
import AppSidebar from './AppSidebar.vue';
import AppNavbar from './AppNavbar.vue';

const collapsed = ref(true);
const themeStore = useThemeStore();
</script>
