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
<script setup>
import '../../../dist/sodesu.css';
import { onMounted } from 'vue';

onMounted(async () => {
  const Sodesu = await import('../../../dist/sodesu.aio.mjs');
  Sodesu.default.init({
    el: '#sodesu-comment',
    serverURL: 'https://walinejs.comment.lithub.cc',
    dark: 'html.dark',
    commentClassName: 'vp-doc',
  });
});
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
