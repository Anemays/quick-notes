<template>
  <header
    :class="[
      'h-12 px-6 flex items-center justify-between shadow-sm border-b transition-colors',
      themeStore.isDark
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200',
    ]"
  >
    <div
      :class="[
        'text-lg font-medium',
        themeStore.isDark ? 'text-white' : 'text-gray-900',
      ]"
    >
      Quick Notes
    </div>
    <div class="flex items-center gap-4">
      <div
        :class="[
          'text-sm',
          themeStore.isDark ? 'text-gray-400' : 'text-gray-500',
        ]"
      >
        Vue 3 + Naive UI
      </div>
      <ThemeToggle />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme';
import ThemeToggle from '../ThemeToggle.vue';

const themeStore = useThemeStore();
</script>
