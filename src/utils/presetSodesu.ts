import type { Preset } from 'unocss';

const presetSodesu = (): Preset => ({
  name: 'preset-sodesu',
  shortcuts: {
    sdsInputBox:
      'border-none outline-none transition-colors duration-300 focus:bg-sBgLight bg-none',
    sdsBtn: 'inline-block',
  },
  rules: [['bb', { 'border-bottom': '2px dashed var(--sodesu-border-color)' }]],
  layers: {
    sodesu: -19, // 1 more then preset-typography
  },
  theme: {
    colors: {
      sWhite: 'var(--sodesu-white)',
      sLightGrey: 'var(--sodesu-light-grey)',
      sDarkGrey: 'var(--sodesu-dark-grey)',
      sTheme: 'var(--sodesu-theme-color)',
      sActive: 'var(--sodesu-active-color)',
      sColor: 'var(--sodesu-color)',
      sBg: 'var(--sodesu-bgcolor)',
      sBgLight: 'var(--sodesu-bgcolor-light)',
      sBgHover: 'var(--sodesu-bgcolor-hover)',
      sBorder: 'var(--sodesu-border-color)',
      sDisableBg: 'var(--sodesu-disable-bgcolor)',
      sDisable: 'var(--sodesu-disable-color)',
      sCodeBg: 'var(--sodesu-code-bgcolor)',
      sBq: 'var(--sodesu-bq-color)',
      sBadge: 'var(--sodesu-badge-color)',
      sInfoBg: 'var(--sodesu-info-bgcolor)',
      sInfo: 'var(--sodesu-info-color)',
    },
  },
  preflights: [
    {
      layer: 'sodesu',
      getCSS: () => `:root {
    
    --sodesu-font-size: 1rem;
  
    
    --sodesu-white: #fff;
    --sodesu-light-grey: #999;
    --sodesu-dark-grey: #666;
  
    
    --sodesu-theme-color: #27ae60;
    --sodesu-active-color: #2ecc71;
  
    
    --sodesu-color: #444;
    --sodesu-bgcolor: #fff;
    --sodesu-bgcolor-light: #f8f8f8;
    --sodesu-bgcolor-hover: #f0f0f0;
    --sodesu-border-color: #ddd;
    --sodesu-disable-bgcolor: #f8f8f8;
    --sodesu-disable-color: #000;
    --sodesu-code-bgcolor: #282c34;
  
    
    --sodesu-bq-color: #f0f0f0;
  
    
    --sodesu-avatar-size: 3.25rem;
    --sodesu-m-avatar-size: calc(var(--sodesu-avatar-size) * 9 / 13);
  
    
    --sodesu-badge-color: #3498db;
    --sodesu-badge-font-size: 0.75em;
  
    
    --sodesu-info-bgcolor: #f8f8f8;
    --sodesu-info-color: #999;
    --sodesu-info-font-size: 0.625em;
  
    --sodesu-border: 1px solid var(--sodesu-border-color);
    --sodesu-avatar-radius: 50%;
    --sodesu-box-shadow: none;
  
    /* --sodesu-border: none;
    --sodesu-box-shadow: 0 12px 40px rgb(134 151 168 / 25%);
    --sodesu-box-shadow: 0 12px 40px #0f0e0d;
    */
  }
  `,
    },
  ],
});

export default presetSodesu;
