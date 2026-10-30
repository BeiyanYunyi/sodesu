import type { Preset } from '@unocss/core';

function presetSodesu(): Preset {
  return {
    name: 'preset-sodesu',
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
          height: 'var(--sds-avatar-real-size)',
        },
      ],
      ['text-badge', { 'font-size': 'var(--sds-badge-font-size)' }],
      ['text-info', { 'font-size': 'var(--sds-info-font-size)' }],
      ['sds-comment', { '--sds-avatar-real-size': 'var(--sds-avatar-size)' }],
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
  .sds-comment .sds-comment {
    --sds-avatar-real-size: var(--sds-m-avatar-size);
  }
  .sds-comment:last-child > .sds-comment-card {
    border-bottom: none;
  }
  .sds-root a {
    color: var(--sds-theme-color);
    text-decoration: none;
  }
  .sds-root a:hover {
    color: var(--sds-active-color);
    text-decoration: underline;
  }
  .sds-root {
    font-size: var(--sds-font-size);
    line-height: 1.75;
    text-align: start;
  }
  .sds-content pre, .sds-content pre[class*="language-"] {
    background: var(--sds-code-bg-color, var(--sds-code-bgcolor));
    margin: .75rem 0;
    padding: 1rem 1.25rem;
    border-radius: 6px;
    line-height: 1.4;
    overflow: auto;
  }
  .sds-root *, .sds-root *::before, .sds-root *::after { box-sizing: border-box; }
  .sds-root button, .sds-root input, .sds-root textarea { font-family: inherit; }
  .sds-root img { max-width: 100%; max-height: 400px; }
  .sds-panel { min-width: 0; width: 100%; margin: .5em; border: var(--sds-border); border-color: var(--sds-border-color); border-radius: .75em; background: var(--sds-bg-color, var(--sds-bgcolor)); box-shadow: var(--sds-box-shadow); }
  .sds-header { display: flex; overflow: hidden; padding: 0 4px; border-bottom: 2px dashed var(--sds-border-color); border-radius: .75em .75em 0 0; }
  .sds-editor { display: block; resize: vertical; width: calc(100% - 1em); min-height: 8.75em; margin: .75em .5em; border: none; border-radius: .5em; background: transparent; color: var(--sds-color); font-size: .875em; outline: none; transition: background .25s; }
  .sds-editor:focus { background: var(--sds-bg-color-light, var(--sds-bgcolor-light)); }
  .sds-editor:disabled { cursor: not-allowed; }
  .sds-button { display: inline-block; min-width: 2.5em; padding: .5em 1em; border: 1px solid var(--sds-border-color); border-radius: .5em; background: transparent; color: var(--sds-color); font-size: .75em; line-height: 1.5; text-align: center; cursor: pointer; touch-action: manipulation; transition: .4s; }
  .sds-button:hover { border-color: var(--sds-theme-color); color: var(--sds-theme-color); }
  .sds-button.primary { border-color: var(--sds-theme-color); background: var(--sds-theme-color); color: var(--sds-white); }
  .sds-button.primary:hover { border-color: var(--sds-active-color); background: var(--sds-active-color); }
  .sds-button:disabled, .sds-button.primary:disabled { border-color: var(--sds-border-color); background: var(--sds-disable-bg-color, var(--sds-disable-bgcolor)); color: var(--sds-disable-color); cursor: not-allowed; }
  .sds-action { display: inline-flex; align-items: center; justify-content: center; width: 1.5em; height: 1.5em; margin: 2px; padding: 0; border: none; background: transparent; color: var(--sds-color); font-size: 16px; cursor: pointer; }
  .sds-action:hover { color: var(--sds-theme-color); }
  .sds-action:disabled { cursor: not-allowed; }
  .sds-warning { margin: 1em .5em; padding: .5em 1em; border: 1px dashed var(--sds-warning-color); border-radius: 5px; background: var(--sds-warning-bg-color); color: var(--sds-warning-color); font-size: .875em; }
  .sds-content { margin-bottom: .75em; padding-top: .625em; font-size: .875em; line-height: 2; overflow-wrap: break-word; }
  .sds-content p { color: var(--sds-color); }
  .sds-content code { padding: .2em .4em; border-radius: 3px; background: var(--sds-bg-color-light, var(--sds-bgcolor-light)); font-size: 85%; }
  .sds-content pre code { color: #bbb; direction: ltr; padding: 0; background: transparent; white-space: pre-wrap; word-break: keep-all; }
  .sds-content blockquote { margin: .5em 0; padding: .5em 0 .5em 1em; border-inline-start: 8px solid var(--sds-bq-color); color: var(--sds-dark-grey); }
  .sds-content blockquote > p { margin: 0; }
  .sds-content ol, .sds-content ul { margin-inline-start: 1.25em; padding: 0; }
  .sds-content table { display: block; overflow: auto; border-collapse: collapse; }
  .sds-content td, .sds-content th { padding: .25em .5em; border: 1px solid var(--sds-border-color); }
  .sds-content .vemoji, .sds-content .wl-emoji { display: inline-block; height: 1.25em; margin: -.125em .25em; vertical-align: baseline; }
  .sds-content .katex-display { overflow: auto hidden; padding: .2em 0; }
  .sds-root hr { margin: .825em 0; border-style: dashed; border-color: var(--sds-bg-color-light, var(--sds-bgcolor-light)); }
  [dir="rtl"] .sds-comment-actions { float: left; }
  @media (max-width: 720px) { .sds-root .sds-comment { --sds-avatar-real-size: var(--sds-m-avatar-size); } }
  @media (max-width: 580px) { .sds-header { display: block; } .sds-header-item:not(:last-child) { border-bottom: 2px dashed var(--sds-border-color); } }
  `,
      },
    ],
  };
}

export default presetSodesu;
