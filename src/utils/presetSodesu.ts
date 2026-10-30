import type { Preset } from '@unocss/core';
import { contentClasses, contentStyles } from './contentStyles';

export interface PresetSodesuOptions {
  /** Include default comment and preview typography. @default true */
  content?: boolean;
}

function presetSodesu({ content = true }: PresetSodesuOptions = {}): Preset {
  return {
    name: 'preset-sodesu',
    shortcuts: content ? { 'sds-content': contentClasses } : {},
    rules: [
      [/^bb-(\d*)$/, ([, d]) => ({ 'border-bottom': `${d}px dashed var(--sds-border-color)` })],
      ['bb-none', { 'border-bottom': 'none' }],
      ['break-word', { 'word-break': 'break-word' }],
      ['text-badge', { 'font-size': 'var(--sds-badge-font-size)' }],
      ['text-info', { 'font-size': 'var(--sds-info-font-size)' }],
      ['sds-btn', { 'padding-inline': '0' }],
    ],
    layers: {
      sodesu: -19, // 1 more than preset-typography
    },
    theme: {
      colors: {
        sWhite: 'var(--sds-white)',
        sLightGrey: 'var(--sds-light-grey)',
        sDarkGrey: 'var(--sds-dark-grey)',
        sTheme: 'var(--sds-theme-color)',
        sActive: 'var(--sds-active-color)',
        sColor: 'var(--sds-color)',
        sBg: 'var(--sds-bg-color, var(--sds-bgcolor))',
        sBgLight: 'var(--sds-bg-color-light, var(--sds-bgcolor-light))',
        sBgHover: 'var(--sds-bg-color-hover, var(--sds-bgcolor-hover))',
        sBorder: 'var(--sds-border-color)',
        sDisableBg: 'var(--sds-disable-bg-color, var(--sds-disable-bgcolor))',
        sDisable: 'var(--sds-disable-color)',
        sCodeBg: 'var(--sds-code-bg-color, var(--sds-code-bgcolor))',
        sBq: 'var(--sds-bq-color)',
        sBadge: 'var(--sds-badge-color)',
        sInfoBg: 'var(--sds-info-bg-color, var(--sds-info-bgcolor))',
        sInfo: 'var(--sds-info-color)',
        sWarning: 'var(--sds-warning-color)',
        sWarningBg: 'var(--sds-warning-bg-color)',
      },
    },
    // Keep content typography optional for consumers using their own prose styles.
    preflights: [
      {
        layer: 'sodesu',
        getCSS: () => `:root {
    --sds-font-size: 1rem;
    --sds-bg-color: var(--sds-bgcolor);
    --sds-bg-color-light: var(--sds-bgcolor-light);
    --sds-bg-color-hover: var(--sds-bgcolor-hover);
    --sds-disable-bg-color: var(--sds-disable-bgcolor);
    --sds-code-bg-color: var(--sds-code-bgcolor);
    --sds-info-bg-color: var(--sds-info-bgcolor);
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
    --sds-warning-color: #915930;
    --sds-warning-bg-color: rgb(234 179 8 / 14%);
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
  .sds-root a {
    color: var(--sds-theme-color);
    text-decoration: none;
  }
  .sds-root a:hover {
    color: var(--sds-active-color);
    text-decoration: underline;
  }
  .sds-root *, .sds-root *::before, .sds-root *::after { box-sizing: border-box; }
  .sds-root button, .sds-root input, .sds-root textarea { font-family: inherit; }
  .sds-root img { max-width: 100%; max-height: 400px; }
  .sds-root hr { margin: .825em 0; border-style: dashed; border-color: var(--sds-bg-color-light, var(--sds-bgcolor-light)); }
  `,
      },
      ...(content ? [{ layer: 'sodesu', getCSS: () => contentStyles }] : []),
    ],
  };
}

export default presetSodesu;
