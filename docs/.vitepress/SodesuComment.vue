<template>
  <div class="container">
    <div id="sodesu-comment" />
  </div>
</template>
<script setup>
import Sodesu from '../../dist/sodesu.aio.mjs';
import '../../dist/sodesu.css';
import { onMounted } from 'vue';

onMounted(() => {
  Sodesu.init({
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
