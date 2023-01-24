import { Component } from 'solid-js';
import commentBoxState, { submitComment } from '../controllers/commentBoxState';
import configProvider from '../controllers/configProvider';
import CommentBoxFooter from './CommentBoxFooter';
import UserMeta from './UserMeta';

const CommentBox: Component = () => {
  const { locale } = configProvider;
  const { replyUser, content, setContent } = commentBoxState;
  return (
    <div class="w-full flex flex-col rounded-xl border border-solid border-sBorder">
      <UserMeta />
      <textarea
        class="my-3 mx-2 min-h-35 font-sans text-sm resize-y rounded-lg sdsInputBox text-sColor"
        onInput={(e) => {
          setContent(e.currentTarget.value);
        }}
        ref={commentBoxState.editorRef}
        value={content()}
        placeholder={replyUser() ? `@${replyUser()}` : locale().placeholder}
        onKeyDown={(e) => {
          const { key } = e;
          if ((e.ctrlKey || e.metaKey) && key === 'Enter') submitComment();
        }}
      />
      <CommentBoxFooter />
    </div>
  );
};

export default CommentBox;
