import { WalineProps } from '@waline/client';
import { getConfig } from '@waline/client/src/utils/config.js';
import { createMemo, createRoot, createSignal } from 'solid-js';

const configProvider = createRoot(() => {
  const [props, setProps] = createSignal<WalineProps>({ serverURL: '', path: '' });
  const config = createMemo(() => getConfig(props()));
  const locale = createMemo(() => config().locale);
  return { setProps, config, locale };
});

export default configProvider;
