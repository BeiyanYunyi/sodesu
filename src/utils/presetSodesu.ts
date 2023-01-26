import type { Preset } from 'unocss';

const presetSodesu = (): Preset => ({
  name: 'preset-sodesu',
  shortcuts: {
    sdsInputBox:
      'border-none outline-none transition-colors duration-300 focus:bg-sBgLight bg-none',
    sdsBtn: 'inline-block',
  },
  rules: [
    [/^bb-(\d*)$/, ([, d]) => ({ 'border-bottom': `${d}px dashed var(--sds-border-color)` })],
    ['bb-none', { 'border-bottom': 'none' }],
    ['break-word', { 'word-break': 'break-word' }],
    [
      'sds-avatar',
      {
        'border-radius': 'var(--sds-avatar-radius)',
        'box-shadow': 'var(--sds-box-shadow)',
        width: 'var(--sds-avatar-real-size)',
      },
    ],
    ['text-badge', { 'font-size': 'var(--sds-badge-font-size)' }],
    ['text-info', { 'font-size': 'var(--sds-info-font-size)' }],
    ['sds-comment', { '--sds-avatar-real-size': 'var(--sds-avatar-size)' }],
  ],
  layers: {
    sodesu: -19, // 1 more then preset-typography
  },
  theme: {
    colors: {
      sWhite: 'var(--sds-white)',
      sLightGrey: 'var(--sds-light-grey)',
      sDarkGrey: 'var(--sds-dark-grey)',
      sTheme: 'var(--sds-theme-color)',
      sActive: 'var(--sds-active-color)',
      sColor: 'var(--sds-color)',
      sBg: 'var(--sds-bgcolor)',
      sBgLight: 'var(--sds-bgcolor-light)',
      sBgHover: 'var(--sds-bgcolor-hover)',
      sBorder: 'var(--sds-border-color)',
      sDisableBg: 'var(--sds-disable-bgcolor)',
      sDisable: 'var(--sds-disable-color)',
      sCodeBg: 'var(--sds-code-bgcolor)',
      sBq: 'var(--sds-bq-color)',
      sBadge: 'var(--sds-badge-color)',
      sInfoBg: 'var(--sds-info-bgcolor)',
      sInfo: 'var(--sds-info-color)',
    },
  },
  preflights: [
    {
      layer: 'sodesu',
      getCSS: () => `:root {
    --sds-font-size: 1rem;
    --sds-white: #fff;
    --sds-light-grey: #999;
    --sds-dark-grey: #666;
    --sds-theme-color: #27ae60;
    --sds-active-color: #2ecc71;
    --sds-color: #444;
    --sds-bgcolor: #fff;
    --sds-bgcolor-light: #f8f8f8;
    --sds-bgcolor-hover: #f0f0f0;
    --sds-border-color: #ddd;
    --sds-disable-bgcolor: #f8f8f8;
    --sds-disable-color: #000;
    --sds-code-bgcolor: #282c34;
    --sds-bq-color: #f0f0f0;
    --sds-avatar-size: 3.25rem;
    --sds-avatar-radius: 50%;
    --sds-m-avatar-size: calc(var(--sds-avatar-size) * 9 / 13);
    --sds-badge-color: #3498db;
    --sds-badge-font-size: 0.75em;
    --sds-info-bgcolor: #f8f8f8;
    --sds-info-color: #999;
    --sds-info-font-size: 0.625em;
    --sds-border: 1px solid var(--sds-border-color);
    --sds-box-shadow: none;
  }
  .sds-comment .sds-comment {
    --sds-avatar-real-size: var(--sds-m-avatar-size);
  }
  .sds-comment:last-child .sds-comment-card {
    border-bottom: none;
  }
  `,
    },
  ],
});

export default presetSodesu;
