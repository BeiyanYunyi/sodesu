import { defineConfig } from 'vitepress';

export default defineConfig({
  lang: 'zh-CN',
  title: 'Sodesu',
  description: 'A Waline-compatible comment system',
  base: '/sodesu/',
  lastUpdated: true,
  cleanUrls: true,
});
