import type { Component } from 'solid-js';
import { createEffect, createMemo, For, Index, Match, Show, Switch } from 'solid-js';
import { Portal } from 'solid-js/web';
import { version } from '../package.json';
import CommentBox from './components/CommentBox';
import CommentCard from './components/CommentCard';
import CommonButton from './components/CommonButton';
import { LoadingIcon } from './components/Icons';
import commentListState, {
  loadMore,
  refresh,
  sortingMethods,
} from './controllers/commentListState';
import configProvider from './controllers/configProvider';
import getDarkStyle from './utils/getDarkStyle';

const App: Component = () => {
  const { config, locale } = configProvider;
  const { data, status, page, totalPages, count, sorting, setSorting } = commentListState;
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
  if (config().noCopyright) {
    // eslint-disable-next-line no-console
    console.log(
      `Comment system powered by Sodesu v${version}, source code: https://github.com/BeiyanYunyi/sodesu`,
    );
  }
  return (
    <div class="sds-root font-sans">
      <Portal mount={document.head}>
        <style>{darkModeStyle()}</style>
      </Portal>
      <CommentBox isMain />
      <div class="flex items-center p-2">
        <div class="flex-shrink flex-grow text-xl text-sColor font-bold">
          <Show when={count()}>
            <span>{count()}</span>
          </Show>{' '}
          {locale().comment}
        </div>
        <ul class="m-0 list-none p-0">
          <For each={sortingMethods}>
            {(item) => (
              <li class="ms-3 inline-block">
                <button
                  class="cursor-pointer border-none bg-transparent pe-0 ps-0 text-[0.75rem] hover:text-sActive"
                  classList={{
                    'text-sColor': item !== sorting(),
                    'text-sTheme': item === sorting(),
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setSorting(item);
                    refresh();
                  }}
                >
                  {locale()[item]}
                </button>
              </li>
            )}
          </For>
        </ul>
      </div>
      <div>
        <Index each={data()}>
          {(item) => <CommentCard content={item()} rootId={item().objectId} />}
        </Index>
      </div>
      <div class="text-center">
        <Show
          when={status() !== 'error'}
          fallback={
            <CommonButton
              onClick={(e) => {
                e.preventDefault();
                refresh();
              }}
            >
              {locale().refresh}
            </CommonButton>
          }
        >
          <Switch>
            <Match when={status() === 'loading'}>
              <div class="flex justify-center text-sInfo">
                <LoadingIcon size="30" />
              </div>
            </Match>
            <Match when={!data().length}>
              <div>{locale().sofa}</div>
            </Match>
            <Match when={page() < totalPages()}>
              <CommonButton
                onClick={(e) => {
                  e.preventDefault();
                  loadMore();
                }}
              >
                {locale().more}
              </CommonButton>
            </Match>
          </Switch>
        </Show>
      </div>
      <div
        class={`py-1 text-end text-sLightGrey text-info ${config().noCopyright ? 'hidden' : ''}`}
      >
        Powered by{' '}
        <a href="https://github.com/BeiyanYunyi/sodesu" target="_blank" rel="noopener noreferrer">
          Sodesu
        </a>{' '}
        v{version}
      </div>
    </div>
  );
};

export default App;
