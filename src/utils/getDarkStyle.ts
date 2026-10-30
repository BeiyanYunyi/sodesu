const style =
  '{--sds-bg-color:var(--sds-bgcolor);--sds-bg-color-light:var(--sds-bgcolor-light);--sds-bg-color-hover:var(--sds-bgcolor-hover);--sds-disable-bg-color:var(--sds-disable-bgcolor);--sds-info-bg-color:var(--sds-info-bgcolor);--sds-white:#000;--sds-light-grey:#666;--sds-dark-grey:#999;--sds-color:#888;--sds-bgcolor:#1e1e1e;--sds-bgcolor-light:#272727;--sds-bgcolor-hover: #444;--sds-border-color:#333;--sds-disable-bgcolor:#444;--sds-disable-color:#272727;--sds-bq-color:#272727;--sds-info-bgcolor:#272727;--sds-info-color:#666}';

function getDarkStyle(selector?: string | boolean, root = ':root'): string {
  if (typeof selector === 'string') {
    return selector === 'auto'
      ? `@media(prefers-color-scheme:dark){${root}${style}}`
      : `${selector} ${root}, ${root}:is(${selector})${style}`;
  }

  return selector === true ? `${root}${style}` : '';
}

export default getDarkStyle;
