import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import commentBoxState, { submitComment } from '../controllers/commentBoxState';
import configProvider from '../controllers/configProvider';
import userInfoState, { userLogin, userLogout } from '../controllers/userInfoState';
import CommonButton from './CommonButton';
import { LoadingIcon, MarkdownIcon, PreviewIcon } from './Icons';

const CommentBoxFooter: Component = () => {
  const { config, locale } = configProvider;
  const { isSubmitting, showPreview, setShowPreview } = commentBoxState;
  const { isLogin } = userInfoState;
  return (
    <div class="mx-3 my-2 flex flex-wrap">
      <div class="flex flex-shrink flex-grow-2 items-center">
        <a
          title="Markdown Guide"
          aria-label="Markdown is supported"
          rel="noopener noreferrer"
          href="https://guides.github.com/features/mastering-markdown/"
          class="m-[2px] h-6 w-6 border-none bg-transparent p-0"
        >
          <MarkdownIcon size="24" />
        </a>
        <button
          type="button"
          class="m-[2px] h-6 w-6 border-none bg-transparent p-0 hover:text-sTheme"
          classList={{ 'text-sActive': showPreview() }}
          title={locale().preview}
          onClick={(e) => {
            e.preventDefault();
            setShowPreview((ori) => !ori);
          }}
        >
          <PreviewIcon />
        </button>
      </div>
      <div class="flex flex-shrink flex-grow-3 items-center justify-end">
        <Show
          when={config().login !== 'disable' && !isLogin()}
          fallback={
            <CommonButton
              type="button"
              onClick={(e) => {
                e.preventDefault();
                userLogout();
              }}
            >
              {locale().logout}
            </CommonButton>
          }
        >
          <CommonButton
            type="button"
            onClick={(e) => {
              e.preventDefault();
              userLogin();
            }}
          >
            {locale().login}
          </CommonButton>
        </Show>
        <Show when={config().login !== 'force' || isLogin()}>
          <button
            type="submit"
            class="mb-0 ms-3 inline-block min-w-10 flex cursor-pointer touch-manipulation select-none justify-center border border-sTheme rounded-lg border-solid bg-sTheme bg-sTheme px-4 py-2 text-xs text-sWhite transition duration-400 disabled:cursor-not-allowed disabled:border-sBorder hover:border-sActive disabled:bg-sDisableBg hover:bg-sActive disabled:text-sDisable disabled:hover:border-sBorder disabled:hover:bg-sDisableBg disabled:hover:text-sDisable"
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
