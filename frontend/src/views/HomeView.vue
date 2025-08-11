<script setup lang="ts">
import { useThemeStore } from '@/stores/theme';
import { useAuthStore } from '@/stores/auth';

const themeStore = useThemeStore();
const authStore = useAuthStore();
</script>

<template>
  <main class="max-w-4xl mx-auto">
    <div class="space-y-6">
      <!-- Header Section -->
      <div class="text-center py-8">
        <h1
          :class="[
            'text-3xl font-light mb-3',
            themeStore.isDark ? 'text-white' : 'text-gray-900',
          ]"
        >
          Quick Notes
        </h1>
        <p
          :class="[
            'text-lg',
            themeStore.isDark ? 'text-gray-300' : 'text-gray-600',
          ]"
        >
          Simple. Fast. Organized.
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-6 mt-12">
        <div
          :class="[
            'text-center p-6 rounded-lg shadow-sm border',
            themeStore.isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200',
          ]"
        >
          <div
            :class="[
              'w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center',
              themeStore.isDark ? 'bg-gray-700' : 'bg-gray-100',
            ]"
          >
            <span class="text-xl">📝</span>
          </div>
          <h3
            :class="[
              'font-medium mb-2',
              themeStore.isDark ? 'text-white' : 'text-gray-900',
            ]"
          >
            Create Notes
          </h3>
          <p
            :class="[
              'text-sm',
              themeStore.isDark ? 'text-gray-400' : 'text-gray-600',
            ]"
          >
            Quickly jot down your thoughts and ideas
          </p>
        </div>

        <div
          :class="[
            'text-center p-6 rounded-lg shadow-sm border',
            themeStore.isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200',
          ]"
        >
          <div
            :class="[
              'w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center',
              themeStore.isDark ? 'bg-gray-700' : 'bg-gray-100',
            ]"
          >
            <span class="text-xl">🗂️</span>
          </div>
          <h3
            :class="[
              'font-medium mb-2',
              themeStore.isDark ? 'text-white' : 'text-gray-900',
            ]"
          >
            Organize
          </h3>
          <p
            :class="[
              'text-sm',
              themeStore.isDark ? 'text-gray-400' : 'text-gray-600',
            ]"
          >
            Keep your notes organized and searchable
          </p>
        </div>

        <div
          :class="[
            'text-center p-6 rounded-lg shadow-sm border',
            themeStore.isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200',
          ]"
        >
          <div
            :class="[
              'w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center',
              themeStore.isDark ? 'bg-gray-700' : 'bg-gray-100',
            ]"
          >
            <span class="text-xl">🌙</span>
          </div>
          <h3
            :class="[
              'font-medium mb-2',
              themeStore.isDark ? 'text-white' : 'text-gray-900',
            ]"
          >
            Dark Mode
          </h3>
          <p
            :class="[
              'text-sm',
              themeStore.isDark ? 'text-gray-400' : 'text-gray-600',
            ]"
          >
            Switch between light and dark themes
          </p>
        </div>
      </div>

      <!-- Get Started Section -->
      <div class="text-center py-8">
        <div v-if="authStore.isAuthenticated" class="space-y-4">
          <p
            :class="[
              'text-lg mb-4',
              themeStore.isDark ? 'text-gray-300' : 'text-gray-600',
            ]"
          >
            Welcome back, {{ authStore.user?.name }}!
          </p>
          <router-link
            to="/notes"
            :class="[
              'inline-flex items-center px-6 py-3 text-base font-medium rounded-lg transition-colors border',
              themeStore.isDark
                ? 'text-white bg-gray-700 hover:bg-gray-600 border-gray-600'
                : 'text-gray-900 bg-gray-100 hover:bg-gray-200 border-gray-300',
            ]"
          >
            Go to Notes
            <span class="ml-2">→</span>
          </router-link>
        </div>
        <div v-else class="space-y-4">
          <router-link
            to="/login"
            :class="[
              'inline-flex items-center px-6 py-3 text-base font-medium rounded-lg transition-colors border mr-4',
              themeStore.isDark
                ? 'text-white bg-gray-700 hover:bg-gray-600 border-gray-600'
                : 'text-gray-900 bg-gray-100 hover:bg-gray-200 border-gray-300',
            ]"
          >
            Get Started
            <span class="ml-2">→</span>
          </router-link>
          <router-link
            to="/login"
            :class="[
              'inline-flex items-center px-6 py-3 text-base font-medium rounded-lg transition-colors border',
              themeStore.isDark
                ? 'text-gray-300 border-gray-600 hover:bg-gray-700'
                : 'text-gray-700 border-gray-300 hover:bg-gray-50',
            ]"
          >
            Sign In
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>
