import {
  For,
  Index,
  Match,
  Show,
  Switch,
  createEffect,
  createMemo,
  type Component,
} from 'solid-js';
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
  return (
    <div class="font-sans sds-root">
      <Portal mount={document.head}>
        <style>{darkModeStyle()}</style>
      </Portal>
      <CommentBox isMain />
      <div class="flex items-center p-2">
        <div class="flex-grow flex-shrink font-bold text-xl text-sColor">
          <Show when={count()}>
            <span>{count()}</span>
          </Show>{' '}
          {locale().comment}
        </div>
        <ul class="p-0 m-0 list-none">
          <For each={sortingMethods}>
            {(item) => (
              <li class="inline-block ms-3">
                <button
                  class="cursor-pointer border-none bg-transparent text-[0.75rem] ps-0 pe-0 hover:text-sActive"
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
      <div class="text-center ">
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
              <div class="text-sInfo flex justify-center">
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
      <div class="py-1 text-sLightGrey text-info text-end">
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
