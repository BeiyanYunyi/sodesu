<template>
  <Layout>
    <template #home-features-after>
      <ClientOnly>
        <div class="home-container">
          <SodesuComment />
        </div>
      </ClientOnly>
    </template>
    <template #doc-after>
      <ClientOnly>
        <div class="home-container">
          <SodesuComment />
        </div>
      </ClientOnly>
    </template>
  </Layout>
</template>
<script setup>
import DefaultTheme from 'vitepress/theme';
import SodesuComment from './SodesuComment.vue';

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
