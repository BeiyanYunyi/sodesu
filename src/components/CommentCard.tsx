import { createDateNow } from '@solid-primitives/date';
import { Index, Show, createMemo, type Component } from 'solid-js';
import commentBoxState from '../controllers/commentBoxState';
import type { ReactiveComment } from '../controllers/commentListState';
import configProvider from '../controllers/configProvider';
import { getTimeAgo } from '../waline/utils/date';
import { isLinkHttp } from '../waline/utils/path';
import CommentBox from './CommentBox';
import CommentCardActions from './CommentCardActions';
import CommentMeta from './CommentMeta';
import { VerifiedIcon } from './Icons';

const CommentCard: Component<{ content: ReactiveComment; rootId: string }> = (props) => {
  const link = createMemo(() => {
    const { link: link2 } = props.content;
    if (!link2) return '';
    return isLinkHttp(link2) ? link2 : `https://${link2}`;
  });
  const { replyId, edit } = commentBoxState;
  const showCommentBox = createMemo(
    () => replyId() === props.content.objectId || edit()?.objectId === props.content.objectId,
  );
  const [now] = createDateNow();
  const { locale, commentClassName } = configProvider;
  const time = createMemo(() => getTimeAgo(new Date(props.content.time), now(), locale()));
  return (
    <div id={props.content.objectId} class="sds-comment flex flex-shrink-0 p-2 pe-0">
      <div aria-hidden class="me-3 relative">
        <Show when={props.content.avatar}>
          <img src={props.content.avatar} alt={props.content.nick} class="sds-avatar" />
          <Show when={props.content.type}>
            <VerifiedIcon />
          </Show>
        </Show>
      </div>
      <div class="sds-comment-card flex-grow flex-shrink min-w-0 pb-2 bb-1">
        <div class="overflow-hidden">
          <Show
            when={link()}
            fallback={
              <span class="text-sDarkGrey inline-block font-bold text-sm decoration-none me-2">
                {props.content.nick}
              </span>
            }
          >
            <a
              class="text-sDarkGrey inline-block font-bold text-sm decoration-none me-2"
              href={link()}
              target="_blank"
              rel="noopener noreferrer"
            >
              {props.content.nick}
            </a>
          </Show>
          <Show when={props.content.type === 'administrator'}>
            <span class="inline-block me-3 p-1 border border-solid border-sBadge text-badge text-sBadge rounded">
              {locale().admin}
            </span>
          </Show>
          <Show when={props.content.label}>
            <span class="inline-block me-3 p-1 border border-solid border-sBadge text-badge text-sBadge rounded">
              {props.content.label}
            </span>
          </Show>
          <Show when={props.content.sticky}>
            <span class="inline-block me-3 p-1 border border-solid border-sBadge text-badge text-sBadge rounded">
              {locale().sticky}
            </span>
          </Show>
          <Show when={props.content.level !== undefined && props.content.level >= 0}>
            <span class="inline-block me-3 p-1 border border-solid border-sBadge text-badge text-sBadge rounded">
              {locale()[`level${props.content.level!}`] || `Level ${props.content.level}`}
            </span>
          </Show>
          <span class="me-3 text-sInfo text-xs">{time()}</span>
          <CommentCardActions comment={props.content} rootId={props.rootId} />
        </div>
        <CommentMeta
          addr={props.content.addr}
          browser={props.content.browser}
          os={props.content.os}
        />
        <div
          class="my-3 text-sm break-word text-sColor sds-content"
          classList={{ [commentClassName()]: true }}
          /* eslint-disable-next-line solid/no-innerhtml */
          innerHTML={props.content.comment()}
        />
        <Show when={showCommentBox()}>
          <CommentBox />
        </Show>
        <Show when={props.content.children}>
          <Index each={props.content.children()}>
            {(item) => <CommentCard content={item()} rootId={props.rootId} />}
          </Index>
        </Show>
      </div>
    </div>
  );
};

export default CommentCard;
