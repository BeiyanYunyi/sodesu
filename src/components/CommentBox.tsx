import { Component, createMemo, Show } from 'solid-js';
import commentBoxState, { submitComment } from '../controllers/commentBoxState';
import configProvider from '../controllers/configProvider';
import userInfoState, { openProfile } from '../controllers/userInfoState';
import CommentBoxFooter from './CommentBoxFooter';
import UserMeta from './UserMeta';

const CommentBox: Component<{ isMain?: boolean }> = (props) => {
  const { locale, config } = configProvider;
  const { replyUser, content, edit, setContent } = commentBoxState;
  const { isLogin, userInfo } = userInfoState;
  const disabled = createMemo(() => props.isMain && !!replyUser());
  return (
    <div class="flex mb-3">
      <Show when={config().login !== 'disable' && isLogin() && !edit()?.objectId}>
        <div class="max-w-20 text-center">
          <div class="sds-comment">
            <button
              title={locale().profile}
              class="bg-transparent border-none hover:bg-transparent cursor-pointer"
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
            class="bg-transparent border-none max-w-20 break-word break-words text-sTheme text-xs hover:bg-transparent hover:text-sActive cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              openProfile();
            }}
          >
            {userInfo()?.display_name}
          </button>
        </div>
      </Show>
      <div class="w-full flex flex-col rounded-xl border border-solid border-sBorder">
        <Show when={config().login !== 'force' && config().meta.length && !isLogin()}>
          <UserMeta />
        </Show>
        <textarea
          class="my-3 mx-2 min-h-35 font-sans text-sm resize-y rounded-lg border-none outline-none transition-colors duration-300 focus:bg-sBgLight bg-none text-sColor disabled:cursor-not-allowed"
          onInput={(e) => {
            setContent(e.currentTarget.value);
          }}
          ref={commentBoxState.editorRef}
          value={content()}
          disabled={disabled()}
          placeholder={(() => {
            if (disabled()) return locale().cancelReply;
            if (replyUser()) return `@${replyUser()}`;
            return locale().placeholder;
          })()}
          onKeyDown={(e) => {
            const { key } = e;
            if ((e.ctrlKey || e.metaKey) && key === 'Enter') submitComment();
          }}
        />
        <CommentBoxFooter disabled={disabled()} />
      </div>
    </div>
  );
};

export default CommentBox;
