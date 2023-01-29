import { Component } from 'solid-js';
import { ReactiveComment } from '../controllers/commentListState';
import configProvider from '../controllers/configProvider';
import { handleLike } from '../controllers/likeState';
import { LikeIcon } from './Icons';

const CommentCardActions: Component<{ comment: ReactiveComment }> = (props) => {
  const { locale } = configProvider;

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
    </div>
  );
};

export default CommentCardActions;
