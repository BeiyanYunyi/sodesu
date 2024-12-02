/* eslint-disable solid/reactivity */
import type { Component } from 'solid-js';
import type SodesuInitOptions from './types/SodesuInitOptions';
import App from './App';
import configProvider from './controllers/configProvider';

const ComponentEntry: Component<Omit<SodesuInitOptions, 'el'>> = (prop) => {
  const { path = window.location.pathname } = prop;
  const { setProps } = configProvider;
  if (!prop.serverURL)
    throw new Error('Option \'serverURL\' is missing!');
  setProps({ ...prop, path });
  return <App />;
};

export default ComponentEntry;
