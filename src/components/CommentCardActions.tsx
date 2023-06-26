import { deleteComment } from '@waline/client/dist/api';
import { type Component, createMemo, Show } from 'solid-js';
import commentBoxState, { clearReplyState } from '../controllers/commentBoxState';
import {
  deleteComment as deleteCommentFront,
  type ReactiveComment,
} from '../controllers/commentListState';
import configProvider from '../controllers/configProvider';
import likeState, { handleLike } from '../controllers/likeState';
import userInfoState from '../controllers/userInfoState';
import { DeleteIcon, EditIcon, LikeIcon, ReplyIcon } from './Icons';

const CommentCardActions: Component<{ comment: ReactiveComment; rootId: string }> = (props) => {
  const { locale, config } = configProvider;
  const { replyId, setReplyId, setReplyUser, setRootId, setContent, setEdit, edit } =
    commentBoxState;
  const { likes } = likeState;
  const liked = createMemo(() => likes()?.includes(props.comment.objectId) || false);
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
      <Show when={isAdmin() || isOwner()}>
        <button
          type="button"
          class="inline-flex items-center border-none bg-transparent text-sColor cursor-pointer sds-btn me-2"
          onClick={async (e) => {
            e.preventDefault();
            if (!confirm('Are you sure you want to delete this comment?')) return;
            const { serverURL, lang } = config();
            await deleteComment({
              serverURL,
              lang,
              token: userInfo()!.token,
              objectId: props.comment.objectId,
            });
            deleteCommentFront(props.comment.objectId);
          }}
        >
          <DeleteIcon />
        </button>
      </Show>
      <button
        type="button"
        class="inline-flex items-center border-none bg-transparent text-sColor hover:text-sActive transition-colors cursor-pointer sds-btn me-2"
        title={liked() ? locale().cancelLike : locale().like}
        onClick={(e) => {
          e.preventDefault();
          handleLike(props.comment);
        }}
      >
        <LikeIcon active={liked()} />
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
