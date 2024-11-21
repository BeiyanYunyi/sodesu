// eslint-disable-next-line import/no-extraneous-dependencies
import { starkdown } from 'starkdown';
import { createEffect, createMemo, createRoot, createSignal, onMount } from 'solid-js';
import type SodesuInitOptions from '../types/SodesuInitOptions';
import type { SodesuConfig, SodesuProps } from '../types/SodesuInitOptions';
import { commentCount } from '../waline/comment';
import { pageviewCount } from '../waline/pageview';
import { getConfig } from '../waline/utils/config';
import { getRoot } from '../waline/utils/getRoot';

const configProvider = createRoot(() => {
  const [props, setProps] = createSignal<SodesuProps>({ serverURL: '', path: '' });
  const [commentClassName, setCommentClassName] = createSignal('');
  const config = createMemo<SodesuConfig>(() => ({
    ...getConfig(props()),
    commentClassName: commentClassName(),
    renderPreview: props().renderPreview || (async (text) => starkdown(text)),
  }));
  const locale = createMemo(() => config().locale);
  const [pageView, setPageView] = createSignal<SodesuInitOptions['pageview']>(undefined);
  const [mountCommentCount, setMountCommentCount] =
    createSignal<SodesuInitOptions['comment']>(undefined);
  const init = ({
    el = '#sodesu',
    path = window.location.pathname,
    ...initProps
  }: SodesuInitOptions) => {
    const root = el ? getRoot(el) : null;
    if (el && !root) throw new Error(`Option 'el' do not match any domElement!`);
    if (!root) throw new Error('Cannot get root!');
    if (!initProps.serverURL) throw new Error("Option 'serverURL' is missing!");
    setProps({ ...initProps, path });
    setCommentClassName(initProps.commentClassName || '');
    setPageView(initProps.pageview);
    setMountCommentCount(initProps.comment);
    return root;
  };
  const update = (opts: Partial<Omit<SodesuInitOptions, 'el'>>) => {
    setProps((p) => ({ ...p, ...opts }));
    if (opts.commentClassName) setCommentClassName(opts.commentClassName);
  };
  const mountPageView = () => {
    if (pageView()) {
      pageviewCount({
        serverURL: config().serverURL,
        path: config().path,
        selector: typeof pageView() === 'string' ? (pageView() as string) : undefined,
      });
    }
  };
  const mountComment = () => {
    if (mountCommentCount()) {
      commentCount({
        serverURL: config().serverURL,
        path: config().path,
        selector:
          typeof mountCommentCount() === 'string' ? (mountCommentCount() as string) : undefined,
      });
    }
  };
  onMount(() => {
    mountPageView();
    mountComment();
  });
  createEffect(() => {
    mountPageView();
  });
  createEffect(() => {
    mountComment();
  });
  return { setProps, config, locale, init, update, commentClassName };
});

export default configProvider;
