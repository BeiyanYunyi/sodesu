import type SodesuInitOptions from './types/SodesuInitOptions';
import { render } from 'solid-js/web';
import App from './App';
import configProvider from './controllers/configProvider';
import 'virtual:uno.css';

const Sodesu = {
  root: undefined as HTMLElement | undefined,
  init: (opt: SodesuInitOptions) => {
    Sodesu.root = configProvider.init(opt);
    render(() => <App />, Sodesu.root!);
  },
  update: (opt: Partial<Omit<SodesuInitOptions, 'el'>>) => {
    configProvider.update(opt);
  },
  destroy: () => {
    if (Sodesu.root) Sodesu.root.innerHTML = '';
  },
};

export default Sodesu;
