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
    },
  },
  stylistic: { semi: true },
});
