<template>
  <NButton
    quaternary
    circle
    size="medium"
    @click="toggleTheme"
    :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
  >
    <template #icon>
      <NIcon size="18">
        <SunnyOutline v-if="isDark" />
        <MoonOutline v-else />
      </NIcon>
    </template>
  </NButton>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui';
import { SunnyOutline, MoonOutline } from '@vicons/ionicons5';
import { useThemeStore } from '../stores/theme';
import { storeToRefs } from 'pinia';

const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);
const { toggleTheme } = themeStore;
</script>
