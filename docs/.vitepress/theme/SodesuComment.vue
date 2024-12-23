<template>
  <div class="vp-doc">
    <hr />
    <blockquote>
      友情提示：评论区仅作评论展示，如有问题咨询请去
      <a href="https://github.com/BeiyanYunyi/sodesu/discussions" target="_blank">
        Github Discussion
      </a>
      中提问。
    </blockquote>
  </div>
  <div class="container">
    <div id="sodesu-comment" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vitepress';
import { onMounted, ref, watch } from 'vue';

import '../../../dist/sodesu-comment.css';

const route = useRoute();

const sodesu = ref<ReturnType<(typeof import('../../../src/index'))['init']> | null>(null);

onMounted(async () => {
  const [Sodesu, remarkRenderer] = await Promise.all([
    import('../../../dist/sodesu.aio.mjs'),
    import('../../../src/utils/remarkRenderer'),
  ]);
  sodesu.value = Sodesu.init({
    el: '#sodesu-comment',
    serverURL: 'https://walinejs.comment.lithub.cc',
    dark: 'html.dark',
    commentClassName: 'vp-doc',
    renderPreview: remarkRenderer.default,
  });
});

watch(
  () => route.path,
  async () => {
    sodesu.value?.update({ path: route.path });
  },
  { immediate: true },
);
</script>

<style scoped>
#sodesu-comment {
  max-width: 1280px;
  width: 100%;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
