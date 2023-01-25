import type { WalineInitOptions, WalineProps } from '@waline/client';
import { createMemo, createRoot, createSignal } from 'solid-js';
import { getConfig } from '../waline/utils/config';
import { getRoot } from '../waline/utils';

const configProvider = createRoot(() => {
  const [props, setProps] = createSignal<WalineProps>({ serverURL: '', path: '' });
  const config = createMemo(() => getConfig(props()));
  const locale = createMemo(() => config().locale);
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
    return root;
  };
  const update = (opts: Partial<Omit<WalineInitOptions, 'el'>>) => {
    setProps((p) => ({ ...p, opts }));
  };
  return { setProps, config, locale, init, update };
});

export default configProvider;
