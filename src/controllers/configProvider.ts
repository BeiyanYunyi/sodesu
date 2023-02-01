import type { WalineInitOptions, WalineProps } from '@waline/client';
import { createEffect, createMemo, createRoot, createSignal } from 'solid-js';
import { commentCount } from '../waline/comment';
import { pageviewCount } from '../waline/pageview';
import { getConfig } from '../waline/utils/config';
import { getRoot } from '../waline/utils/getRoot';

const configProvider = createRoot(() => {
  const [props, setProps] = createSignal<WalineProps>({ serverURL: '', path: '' });
  const config = createMemo(() => getConfig(props()));
  const locale = createMemo(() => config().locale);
  const [pageView, setPageView] = createSignal<WalineInitOptions['pageview']>(undefined);
  const [mountCommentCount, setMountCommentCount] =
    createSignal<WalineInitOptions['comment']>(undefined);
  const init = ({
    el = '#sodesu',
    path = window.location.pathname,
    ...initProps
  }: WalineInitOptions) => {
    const root = el ? getRoot(el) : null;
    if (el && !root) throw new Error(`Option 'el' do not match any domElement!`);
    if (!root) throw new Error('Cannot get root!');
    if (!initProps.serverURL) throw new Error("Option 'serverURL' is missing!");
    setProps({ ...initProps, path });
    setPageView(initProps.pageview);
    setMountCommentCount(initProps.comment);
    return root;
  };
  const update = (opts: Partial<Omit<WalineInitOptions, 'el'>>) => {
    setProps((p) => ({ ...p, opts }));
  };
  createEffect(() => {
    if (pageView()) {
      pageviewCount({
        serverURL: config().serverURL,
        path: config().path,
        selector: typeof pageView() === 'string' ? (pageView() as string) : undefined,
      });
    }
  });
  createEffect(() => {
    if (mountCommentCount()) {
      commentCount({
        serverURL: config().serverURL,
        path: config().path,
        selector:
          typeof mountCommentCount() === 'string' ? (mountCommentCount() as string) : undefined,
      });
    }
  });
  return { setProps, config, locale, init, update };
});

export default configProvider;
