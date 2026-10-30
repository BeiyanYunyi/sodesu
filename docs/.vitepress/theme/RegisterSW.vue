<script setup lang="ts">
import { onMounted } from 'vue';
import { withBase } from 'vitepress';

// The docs have disabled offline caching. Update an existing worker so sw.js
// can unregister it; do not register a new worker on every page load.
onMounted(async () => {
  if (!('serviceWorker' in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.getRegistration(withBase('/'));
    if (registration?.active?.scriptURL === new URL(withBase('/sw.js'), location.href).href) {
      await registration.update();
    }
  } catch (error) {
    console.error('Service Worker cleanup failed', error);
  }
});
</script>
<template></template>
