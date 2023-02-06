import { defineConfig } from 'vitepress';

export default defineConfig({
  lang: 'zh-CN',
  title: 'Sodesu',
  description: 'A Waline-compatible comment system',
  base: process.env.DOCS_BASE,
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    socialLinks: [{ icon: 'github', link: 'https://github.com/BeiyanYunyi/sodesu' }],
    editLink: {
      pattern: 'https://github.com/BeiyanYunyi/sodesu/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
    footer: {
      message: 'Released under the AGPL-3.0-or-later License.',
      copyright: 'Copyleft © 2022-present Beiyan Yunyi',
    },
    lastUpdatedText: '上次更新于',
    outline: [2, 3],
    nav: [
      { text: '🚀 快速开始', link: '/guide/getting-started' },
      { text: '➕ 特色功能', link: '/special-features' },
      { text: '➖ 功能精简', link: '/trade-offs' },
    ],
  },
});
