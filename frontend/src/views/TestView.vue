<template>
  <div
    style="
      background: red;
      color: white;
      padding: 20px;
      font-size: 24px;
      min-height: 100vh;
    "
  >
    <h1>TEST PAGE WORKS!</h1>
    <p>Router: {{ $route.path }}</p>
    <p>Time: {{ new Date().toLocaleTimeString() }}</p>
    <router-link to="/" style="color: yellow">Go Home</router-link>
  </div>
</template>

<script setup lang="ts">
// Simple test page
</script>
