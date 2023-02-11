<template>
  <Layout>
    <template #home-features-after>
      <div class="home-container">
        <SodesuComment />
      </div>
    </template>
    <template #doc-after>
      <SodesuComment />
    </template>
    <template #layout-bottom>
      <ReloadPrompt />
      <link
        v-if="isDark"
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-dark.min.css"
      />
      <link
        v-else
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css"
      />
    </template>
  </Layout>
</template>
<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import SodesuComment from './SodesuComment.vue';
import ReloadPrompt from './ReloadPrompt.vue';
import { useData } from 'vitepress';

const { isDark } = useData();
const { Layout } = DefaultTheme;
</script>
<style scoped>
.home-container {
  margin-top: 1rem;
  max-width: 1152px;
  margin-left: auto;
  margin-right: auto;
}
</style>
