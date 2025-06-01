<template>
  <div ref="exampleContainer" />
</template>
<script setup lang="ts">
import type { VM } from '@stackblitz/sdk';
import sdk from '@stackblitz/sdk';
import { onMounted, onUnmounted, ref } from 'vue';

const exampleContainer = ref<HTMLDivElement>();
const vm = ref<VM>();

onMounted(() =>
  sdk
    .embedProjectId(exampleContainer.value!, 'sodesu-react-example', {
      forceEmbedLayout: true,
      openFile: 'src/components/Comments.tsx',
      clickToLoad: true,
      hideExplorer: true,
      height: 600,
      view: 'preview',
    })
    .then((value) => {
      vm.value = value;
    }),
);

onUnmounted(() => {
  exampleContainer.value && (exampleContainer.value.innerHTML = '');
});
</script>
