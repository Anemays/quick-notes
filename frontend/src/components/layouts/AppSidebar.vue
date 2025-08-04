<template>
  <aside
    :class="[
      'transition-all duration-300 shadow-sm h-full border-r flex flex-col',
      collapsed ? 'w-12' : 'w-40',
      themeStore.isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    ]"
  >
    <!-- Toggle button -->
    <div class="pl-3">
      <button
        @click="$emit('toggle')"
        data-test="toggle-button"
        :class="[
          'my-3 transition-colors',
          themeStore.isDark 
            ? 'text-gray-400 hover:text-gray-200' 
            : 'text-gray-500 hover:text-gray-700'
        ]"
      >
        <n-icon size="24">
          <ChevronForward v-if="collapsed" />
          <ChevronBack v-else />
        </n-icon>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-1 px-1 text-sm">
      <router-link
        to="/"
        :class="[
          'flex items-center gap-2 px-2 py-2 rounded-md transition-all',
          themeStore.isDark 
            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        ]"
        class="router-link"
      >
        <n-icon size="18">
          <Home />
        </n-icon>
        <span v-if="!collapsed">Home</span>
      </router-link>

      <router-link
        to="/notes"
        :class="[
          'flex items-center gap-2 px-2 py-2 rounded-md transition-all',
          themeStore.isDark 
            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        ]"
        class="router-link"
      >
        <n-icon size="18">
          <DocumentText />
        </n-icon>
        <span v-if="!collapsed">Notes</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import {
  ChevronForward,
  ChevronBack,
  DocumentText,
  Home,
} from '@vicons/ionicons5';
import { NIcon } from 'naive-ui';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();

defineProps<{
  collapsed: boolean;
}>();

defineEmits(['toggle']);
</script>

<style scoped>
.router-link.router-link-active {
  background-color: #eff6ff;
  color: #2563eb;
}

:global(.dark) .router-link.router-link-active {
  background-color: #1e40af;
  color: #93c5fd;
}
</style>
