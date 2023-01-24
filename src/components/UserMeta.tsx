import { Component, createMemo, For } from 'solid-js';
import { userMetaState } from '../controllers/commentBoxState';
import configProvider from '../controllers/configProvider';

const UserMeta: Component = () => {
  const { config, locale } = configProvider;
  const { userMeta, setUserMeta, inputRefs } = userMetaState;
  return (
    <div class="flex flex-wrap justify-evenly px-4 text-[0.625rem] bb">
      <For each={config().meta}>
        {(kind) => {
          const value = createMemo(() => userMeta()[kind]);
          return (
            <div class="flex flex-grow items-center">
              <label for={`wl-${kind}`} class="py-3 px-2">
                {locale()[kind] +
                  (config().requiredMeta.includes(kind) || !config().requiredMeta.length
                    ? ''
                    : `(${locale().optional})`)}
              </label>
              <input
                id={`wl-${kind}`}
                type={kind === 'mail' ? 'email' : 'text'}
                class="flex-grow p-2 sdsInputBox text-sColor"
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
