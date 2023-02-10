import { Component, createMemo, Show } from 'solid-js';
import commentBoxState, { clearReplyState } from '../controllers/commentBoxState';
import { ReactiveComment } from '../controllers/commentListState';
import configProvider from '../controllers/configProvider';
import { handleLike } from '../controllers/likeState';
import userInfoState from '../controllers/userInfoState';
import { EditIcon, LikeIcon, ReplyIcon } from './Icons';

const CommentCardActions: Component<{ comment: ReactiveComment; rootId: string }> = (props) => {
  const { locale } = configProvider;
  const { replyId, setReplyId, setReplyUser, setRootId, setContent, setEdit, edit } =
    commentBoxState;
  const isReplyingCurrent = createMemo(() => replyId() === props.comment.objectId);
  const { userInfo, isAdmin } = userInfoState;
  const isOwner = createMemo(() =>
    Boolean(props.comment.user_id && userInfo()?.objectId === props.comment.user_id),
  );
  const editingThis = createMemo(() => edit()?.objectId === props.comment.objectId);
  return (
    <div class="float-right">
      <Show when={isAdmin() || isOwner()}>
        <button
          type="button"
          class="inline-flex items-center border-none bg-transparent text-sColor hover:text-sActive transition-colors cursor-pointer sds-btn me-2"
          onClick={(e) => {
            e.preventDefault();
            if (editingThis()) {
              setEdit(null);
              setContent('');
            } else {
              setEdit(props.comment);
              setContent(props.comment.orig() || '');
            }
          }}
        >
          <EditIcon />
        </button>
      </Show>
      <button
        type="button"
        class="inline-flex items-center border-none bg-transparent text-sColor hover:text-sActive transition-colors cursor-pointer sds-btn me-2"
        title={props.comment.like() ? locale().cancelLike : locale().like}
        onClick={(e) => {
          e.preventDefault();
          handleLike(props.comment);
        }}
      >
        <LikeIcon active={!!props.comment.like()} />
        <span>{props.comment.like()}</span>
      </button>
      <Show when={!editingThis()}>
        <button
          type="button"
          class="inline-flex items-center border-none bg-transparent text-sColor hover:text-sActive transition-colors cursor-pointer sds-btn"
          title={isReplyingCurrent() ? locale().cancelReply : locale().reply}
          onClick={(e) => {
            e.preventDefault();
            if (isReplyingCurrent()) {
              clearReplyState();
            } else {
              setReplyId(props.comment.objectId);
              setReplyUser(props.comment.nick);
              setRootId(props.rootId);
              setContent('');
            }
          }}
        >
          <ReplyIcon />
        </button>
      </Show>
    </div>
  );
};

export default CommentCardActions;
