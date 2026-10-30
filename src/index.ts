import { flushSync, mount, unmount } from 'svelte';
import App from './App.svelte';
import type SodesuInitOptions from './types/SodesuInitOptions';
import { getRoot } from './vendor/waline/utils/getRoot';
import 'virtual:uno.css';

export type { default as SodesuInitOptions } from './types/SodesuInitOptions';
export function init({ el = '#sodesu', ...options }: SodesuInitOptions) {
  const target = el ? getRoot(el) : null;
  if (!target) throw new Error("Option 'el' does not match any DOM element!");
  if (!options.serverURL) throw new Error("Option 'serverURL' is missing!");
  const app = mount(App, { target, props: options });
  flushSync();
  let destroyed = false;
  return {
    update(options: Partial<Omit<SodesuInitOptions, 'el'>>) {
      if (destroyed) return;
      if ('serverURL' in options && !options.serverURL)
        throw new Error("Option 'serverURL' is missing!");
      app.update(options);
      flushSync();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      return unmount(app);
    },
  };
}
export default { init };
