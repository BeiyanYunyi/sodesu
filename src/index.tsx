import type SodesuInitOptions from './types/SodesuInitOptions';
import { render } from 'solid-js/web';
import App from './App';
import configProvider from './controllers/configProvider';
import 'virtual:uno.css';

export const init = (opt: SodesuInitOptions) => {
  const root = configProvider.init(opt);
  render(() => <App />, root);

  return {
    update: (opt: Partial<Omit<SodesuInitOptions, 'el'>>) => {
      configProvider.update(opt);
    },
    destroy: () => {
      root.innerHTML = '';
    },
  };
};
