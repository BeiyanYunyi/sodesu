import { Component, createMemo } from 'solid-js';
import { Portal } from 'solid-js/web';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'virtual:uno.css';
import CommentBox from './components/CommentBox';
import configProvider from './controllers/configProvider';
import getDarkStyle from './utils/getDarkStyle';

const App: Component = () => {
  const { config } = configProvider;
  const darkModeStyle = createMemo(() => getDarkStyle(config().dark));
  return (
    <div class="font-sans">
      <h1 class="text-4xl text-center select-none">Hello Vite + Solid</h1>
      <Portal mount={document.head}>
        <style>{darkModeStyle()}</style>
      </Portal>
      <CommentBox />
    </div>
  );
};

export default App;
