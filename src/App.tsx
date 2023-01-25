import { Component, createEffect, createMemo, Index } from 'solid-js';
import { Portal } from 'solid-js/web';
import CommentBox from './components/CommentBox';
import CommentCard from './components/CommentCard';
import commentListState, { refresh } from './controllers/commentListState';
import configProvider from './controllers/configProvider';
import getDarkStyle from './utils/getDarkStyle';

const App: Component = () => {
  const { config } = configProvider;
  const { data } = commentListState;
  const darkModeStyle = createMemo(() => getDarkStyle(config().dark));
  refresh();
  createEffect(
    (prev: { serverURL: string; path: string }) => {
      if (prev.serverURL === config().serverURL && prev.path === config().path)
        return { serverURL: config().serverURL, path: config().path };
      refresh();
      return { serverURL: config().serverURL, path: config().path };
    },
    { serverURL: config().serverURL, path: config().path },
  );
  createEffect(() => {
    console.log(data());
  });
  return (
    <div class="font-sans">
      <h1 class="text-4xl text-center select-none">Hello Vite + Solid</h1>
      <Portal mount={document.head}>
        <style>{darkModeStyle()}</style>
      </Portal>
      <CommentBox />
      <div>
        <Index each={data()}>{(item) => <CommentCard content={item()} />}</Index>
      </div>
    </div>
  );
};

export default App;
