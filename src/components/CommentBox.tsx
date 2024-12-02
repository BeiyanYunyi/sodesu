import { type Component, createMemo, Show } from 'solid-js';
import commentBoxState, { submitComment } from '../controllers/commentBoxState';
import configProvider from '../controllers/configProvider';
import userInfoState, { openProfile } from '../controllers/userInfoState';
import CommentBoxFooter from './CommentBoxFooter';
import UserMeta from './UserMeta';

const CommentBox: Component<{ isMain?: boolean }> = (props) => {
  const { locale, config } = configProvider;
  const { replyUser, content, edit, setContent, showPreview, previewText } = commentBoxState;
  const { isLogin, userInfo } = userInfoState;
  const disabled = createMemo(() => props.isMain && (!!replyUser() || !!edit()));
  return (
    <Show when={!disabled()}>
      <div class="mb-3 flex">
        <Show when={config().login !== 'disable' && isLogin() && !edit()?.objectId}>
          <div class="me-2 max-w-20 text-center">
            <div class="sds-comment">
              <button
                title={locale().profile}
                class="cursor-pointer border-none bg-transparent hover:bg-transparent"
                onClick={(e) => {
                  e.preventDefault();
                  openProfile();
                }}
              >
                <img src={userInfo()?.avatar} alt="Avatar of current user" class="sds-avatar" />
              </button>
            </div>
            <button
              title={locale().profile}
              class="max-w-20 cursor-pointer break-words border-none bg-transparent text-xs text-sTheme break-word hover:bg-transparent hover:text-sActive"
              onClick={(e) => {
                e.preventDefault();
                openProfile();
              }}
            >
              {userInfo()?.display_name}
            </button>
          </div>
        </Show>
        <div class="w-full flex flex-col border border-sBorder rounded-xl border-solid">
          <Show when={config().login !== 'force' && config().meta.length && !isLogin()}>
            <UserMeta />
          </Show>
          <textarea
            class="mx-2 my-3 min-h-35 resize-y rounded-lg border-none bg-transparent text-sm text-sColor font-sans outline-none transition-colors duration-300 disabled:cursor-not-allowed focus:bg-sBgLight"
            onInput={(e) => {
              setContent(e.currentTarget.value);
            }}
            ref={commentBoxState.editorRef}
            value={content()}
            placeholder={(() => {
              if (replyUser())
                return `@${replyUser()}`;
              return locale().placeholder;
            })()}
            onKeyDown={(e) => {
              const { key } = e;
              if ((e.ctrlKey || e.metaKey) && key === 'Enter')
                submitComment();
            }}
          />
          <Show when={showPreview()}>
            {
              <div class="py-2 pl-2">
                <hr class="my-[0.825rem] border-sBgLight border-dashed" />
                <h4>{locale().preview}</h4>
                <div
                  class={`my-3 text-sm break-word text-sColor sds-content ${
                    config().commentClassName
                  }`}
                  /* eslint-disable-next-line solid/no-innerhtml */
                  innerHTML={previewText()}
                />
              </div>
            }
          </Show>
          <CommentBoxFooter />
        </div>
      </div>
    </Show>
  );
};

export default CommentBox;
