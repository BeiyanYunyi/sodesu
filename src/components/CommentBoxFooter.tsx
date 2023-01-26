import { Component, Show } from 'solid-js';
import commentBoxState, { submitComment } from '../controllers/commentBoxState';
import configProvider from '../controllers/configProvider';
import userInfoState, { userLogin } from '../controllers/userInfoState';
import { LoadingIcon, MarkdownIcon } from './Icons';

const CommentBoxFooter: Component = () => {
  const { config, locale } = configProvider;
  const { isSubmitting } = commentBoxState;
  const { isLogin } = userInfoState;
  return (
    <div class="flex flex-wrap my-2 mx-3">
      <div class="flex flex-grow-2 flex-shrink items-center">
        <a
          title="Markdown Guide"
          aria-label="Markdown is supported"
          rel="noopener noreferrer"
          href="https://guides.github.com/features/mastering-markdown/"
          class="w-6 h-6 m-[2px] p-0 border-none bg-transparent text-sTheme decoration-none break-word hover:text-sActive"
        >
          <MarkdownIcon size="24" />
        </a>
      </div>
      <div class="flex flex-grow-3 flex-shrink items-center justify-end">
        <Show when={config().login !== 'disable' && !isLogin()}>
          <button
            type="button"
            class="inline-block min-w-10 mb-0 py-2 px-4 bg-transparent text-sColor text-xs text-center select-none border cursor-pointer touch-manipulation border-solid border-sBorder rounded-lg transition duration-400 ms-3 hover:(border-sTheme text-sTheme)"
            onClick={(e) => {
              e.preventDefault();
              userLogin();
            }}
          >
            {locale().login}
          </button>
        </Show>
        <Show when={config().login !== 'force' || isLogin()}>
          <button
            type="submit"
            class="inline-block min-w-10 mb-0 py-2 px-4 bg-sTheme text-sWhite text-xs flex justify-center select-none border cursor-pointer touch-manipulation border-solid border-sTheme bg-sTheme rounded-lg transition duration-400 ms-3 disabled:(border-sBorder bg-sDisableBg text-sDisable cursor-not-allowed hover:(border-sBorder bg-sDisableBg text-sDisable)) hover:(border-sActive bg-sActive)"
            disabled={isSubmitting()}
            onClick={(e) => {
              e.preventDefault();
              submitComment();
            }}
          >
            <Show when={isSubmitting()} fallback={locale().submit}>
              <LoadingIcon size="16" />
            </Show>
          </button>
        </Show>
      </div>
    </div>
  );
};

export default CommentBoxFooter;
