import type SodesuInitOptions from './types/SodesuInitOptions';
import { render } from 'solid-js/web';
import App from './App';
import configProvider from './controllers/configProvider';

const Sodesu = {
  init: (opt: SodesuInitOptions) => {
    const root = configProvider.init(opt);
    render(() => <App />, root);
  },
  update: (opt: Partial<Omit<SodesuInitOptions, 'el'>>) => {
    configProvider.update(opt);
  },
};

export default Sodesu;
