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
    </template>
  </Layout>
</template>
<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import SodesuComment from './SodesuComment.vue';
import ReloadPrompt from './ReloadPrompt.vue';

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
