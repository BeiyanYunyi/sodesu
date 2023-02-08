import DefaultTheme from 'vitepress/theme';
import SodesuLayout from './SodesuLayout.vue';

const theme: typeof DefaultTheme = {
  ...DefaultTheme,
  Layout: SodesuLayout,
  enhanceApp: (ctx) => {
    DefaultTheme.enhanceApp(ctx);
    if (typeof window !== 'undefined') {
      ctx.router.onAfterRouteChanged = async (to) => {
        const Sodesu = await import('../../../dist/sodesu.aio.mjs');
        Sodesu.default.update({ path: window.location.pathname });
      };
    }
  },
};

export default theme;
