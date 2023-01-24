import type { WalineInitOptions } from '@waline/client';
import { render } from 'solid-js/web';
import App from './App';
import configProvider from './controllers/configProvider';

const Sodesu = {
  init: (opt: WalineInitOptions) => {
    const root = configProvider.init(opt);
    render(() => <App />, root);
  },
  update: (opt: Partial<Omit<WalineInitOptions, 'el'>>) => {
    configProvider.update(opt);
  },
};

export default Sodesu;
