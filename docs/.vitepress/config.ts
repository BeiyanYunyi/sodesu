import { defineConfig } from 'vitepress';

export default defineConfig({
  lang: 'zh-CN',
  title: 'Sodesu',
  description: 'A Waline-compatible comment system',
  base: process.env.DOCS_BASE,
  lastUpdated: true,
  cleanUrls: true,
});
