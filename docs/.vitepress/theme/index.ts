import DefaultTheme from 'vitepress/theme';
import SodesuLayout from './SodesuLayout.vue';
import 'katex/dist/katex.min.css';

const theme = {
  ...DefaultTheme,
  Layout: SodesuLayout,
};

export default theme;
