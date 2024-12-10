import antfu from '@antfu/eslint-config';

export default antfu({
  formatters: true,
  unocss: true,
  solid: true,
  vue: {
    overrides: {
      'vue/block-order': [
        'error',
        {
          order: ['template', 'script', 'style'],
        },
      ],
      'vue/html-self-closing': 0,
    },
  },
  stylistic: false,
});
