<template>
  <aside
    :class="[
      'transition-all duration-300 bg-white shadow-md h-full border-r',
      collapsed ? 'w-12' : 'w-40',
    ]"
    class="flex flex-col"
  >
    <!-- Toggle button -->
    <div class="pl-3">
      <button
        @click="$emit('toggle')"
        data-test="toggle-button"
        class="my-3 text-gray-500 hover:text-blue-600 transition-colors"
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
        class="flex items-center gap-2 px-2 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
      >
        <n-icon size="18">
          <Home />
        </n-icon>
        <span v-if="!collapsed">Home</span>
      </router-link>

      <router-link
        to="/notes"
        class="flex items-center gap-2 px-2 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
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

defineProps<{
  collapsed: boolean;
}>();

defineEmits(['toggle']);
</script>

<style scoped>
.router-link-active {
  background-color: #eff6ff;
  color: #2563eb;
}
</style>
