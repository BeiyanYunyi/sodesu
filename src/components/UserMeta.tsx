import { type Component, createMemo, For } from 'solid-js';
import { userMetaState } from '../controllers/commentBoxState';
import configProvider from '../controllers/configProvider';

const UserMeta: Component = () => {
  const { config, locale } = configProvider;
  const { userMeta, setUserMeta, inputRefs } = userMetaState;
  return (
    <div class="bb flex flex-wrap justify-evenly px-4 text-[0.625rem]">
      <For each={config().meta}>
        {(kind) => {
          const value = createMemo(() => userMeta()[kind]);
          return (
            <div class="flex flex-grow items-center">
              <label for={`wl-${kind}`} class="px-2 py-3 text-sColor">
                {locale()[kind]
                + (config().requiredMeta.includes(kind) || !config().requiredMeta.length
                  ? ''
                  : `(${locale().optional})`)}
              </label>
              <input
                id={`wl-${kind}`}
                type={kind === 'mail' ? 'email' : 'text'}
                class="flex-grow border-none bg-transparent p-2 text-sColor outline-none transition-colors duration-300 focus:bg-sBgLight"
                value={value()}
                ref={inputRefs[kind]}
                onInput={(e) => {
                  setUserMeta({ ...userMeta(), [kind]: e.currentTarget.value });
                }}
              />
            </div>
          );
        }}
      </For>
    </div>
  );
};

export default UserMeta;
