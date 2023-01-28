/* eslint-disable solid/reactivity */
import type { Component } from 'solid-js';
import type { WalineInitOptions } from '@waline/client';
import configProvider from './controllers/configProvider';
import App from './App';

const ComponentEntry: Component<Omit<WalineInitOptions, 'el'>> = (prop) => {
  const { path = window.location.pathname } = prop;
  const { setProps } = configProvider;
  if (!prop.serverURL) throw new Error("Option 'serverURL' is missing!");
  setProps({ ...prop, path });
  configProvider.init(prop);
  return <App />;
};

export default ComponentEntry;
