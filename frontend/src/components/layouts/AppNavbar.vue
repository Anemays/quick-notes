<template>
  <header
    :class="[
      'h-12 px-6 flex items-center justify-between shadow-sm border-b transition-colors',
      themeStore.isDark
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200',
    ]"
  >
    <router-link
      to="/"
      :class="[
        'text-lg font-medium hover:opacity-80 transition-opacity',
        themeStore.isDark ? 'text-white' : 'text-gray-900',
      ]"
    >
      Quick Notes
    </router-link>
    <div class="flex items-center gap-4">
      <!-- User info when authenticated -->
      <div v-if="authStore.isAuthenticated" class="flex items-center gap-3">
        <span
          :class="[
            'text-sm',
            themeStore.isDark ? 'text-gray-300' : 'text-gray-600',
          ]"
        >
          {{ authStore.user?.name }}
        </span>
        <button
          @click="handleLogout"
          :class="[
            'text-sm px-3 py-1 rounded transition-colors',
            themeStore.isDark
              ? 'text-gray-300 hover:text-white hover:bg-gray-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
          ]"
        >
          Logout
        </button>
      </div>

      <!-- Login button when not authenticated -->
      <router-link
        v-else
        to="/login"
        :class="[
          'text-sm px-3 py-1 rounded transition-colors',
          themeStore.isDark
            ? 'text-gray-300 hover:text-white hover:bg-gray-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
        ]"
      >
        Sign In
      </router-link>

      <ThemeToggle />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useThemeStore } from '@/stores/theme';
import { useAuthStore } from '@/stores/auth';
import ThemeToggle from '../ThemeToggle.vue';

const router = useRouter();
const themeStore = useThemeStore();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>
