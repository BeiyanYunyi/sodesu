import { Component, createMemo } from 'solid-js';
import commentBoxState, { clearReplyState } from '../controllers/commentBoxState';
import { ReactiveComment } from '../controllers/commentListState';
import configProvider from '../controllers/configProvider';
import { handleLike } from '../controllers/likeState';
import { LikeIcon, ReplyIcon } from './Icons';

const CommentCardActions: Component<{ comment: ReactiveComment; rootId: string }> = (props) => {
  const { locale } = configProvider;
  const { replyId, setReplyId, setReplyUser, setRootId, setContent } = commentBoxState;
  const isReplyingCurrent = createMemo(() => replyId() === props.comment.objectId);

  return (
    <div class="float-right">
      <button
        type="button"
        class="inline-flex items-center border-none bg-transparent text-sColor hover:text-sActive transition-colors cursor-pointer"
        title={props.comment.like() ? locale().cancelLike : locale().like}
        onClick={(e) => {
          e.preventDefault();
          handleLike(props.comment);
        }}
      >
        <LikeIcon active={!!props.comment.like()} />
        <span>{props.comment.like()}</span>
      </button>
      <button
        type="button"
        class="inline-flex items-center border-none bg-transparent text-sColor hover:text-sActive transition-colors cursor-pointer"
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
    </div>
  );
};

export default CommentCardActions;
