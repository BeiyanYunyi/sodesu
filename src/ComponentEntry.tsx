/* eslint-disable solid/reactivity */
import type { Component } from 'solid-js';
import App from './App';
import configProvider from './controllers/configProvider';
import type SodesuInitOptions from './types/SodesuInitOptions';

const ComponentEntry: Component<Omit<SodesuInitOptions, 'el'>> = (prop) => {
  const { path = window.location.pathname } = prop;
  const { setProps } = configProvider;
  if (!prop.serverURL) throw new Error("Option 'serverURL' is missing!");
  setProps({ ...prop, path });
  return <App />;
};

export default ComponentEntry;
