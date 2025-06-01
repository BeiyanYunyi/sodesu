import type { Component } from 'solid-js';
import type { ReactiveComment } from '../controllers/commentListState';
import { createDateNow } from '@solid-primitives/date';
import { createMemo, Index, Show } from 'solid-js';
import commentBoxState from '../controllers/commentBoxState';
import configProvider from '../controllers/configProvider';
import { getTimeAgo } from '../waline/utils/date';
import { isLinkHttp } from '../waline/utils/path';
import CommentBox from './CommentBox';
import CommentCardActions from './CommentCardActions';
import CommentMeta from './CommentMeta';
import { VerifiedIcon } from './Icons';

const CommentCard: Component<{ content: ReactiveComment; rootId: number }> = (props) => {
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
    <div id={props.content.objectId.toString()} class="flex p-2 pe-0 sds-comment">
      <div aria-hidden class="relative me-3 flex-shrink-0">
        <Show when={props.content.avatar}>
          <img class="sds-avatar" src={props.content.avatar} alt={props.content.nick} />
          <Show when={props.content.type}>
            <VerifiedIcon />
          </Show>
        </Show>
      </div>
      <div class="sds-comment-card min-w-0 flex-shrink flex-grow pb-2 bb-1">
        <div class="overflow-hidden">
          <Show
            when={link()}
            fallback={
              <span class="me-2 inline-block text-sm text-sDarkGrey font-bold decoration-none">
                {props.content.nick}
              </span>
            }
          >
            <a
              class="me-2 inline-block text-sm text-sDarkGrey font-bold decoration-none"
              href={link()}
              target="_blank"
              rel="noopener noreferrer"
            >
              {props.content.nick}
            </a>
          </Show>
          <Show when={props.content.type === 'administrator'}>
            <span class="me-3 inline-block border border-sBadge rounded border-solid p-1 text-sBadge text-badge">
              {locale().admin}
            </span>
          </Show>
          <Show when={props.content.label}>
            <span class="me-3 inline-block border border-sBadge rounded border-solid p-1 text-sBadge text-badge">
              {props.content.label}
            </span>
          </Show>
          <Show when={props.content.sticky}>
            <span class="me-3 inline-block border border-sBadge rounded border-solid p-1 text-sBadge text-badge">
              {locale().sticky}
            </span>
          </Show>
          <Show when={props.content.level !== undefined && props.content.level >= 0}>
            <span class="me-3 inline-block border border-sBadge rounded border-solid p-1 text-sBadge text-badge">
              {locale()[`level${props.content.level!}`] || `Level ${props.content.level}`}
            </span>
          </Show>
          <span class="me-3 text-xs text-sInfo">{time()}</span>
          <CommentCardActions comment={props.content} rootId={props.rootId} />
        </div>
        <CommentMeta
          addr={props.content.addr}
          browser={props.content.browser}
          os={props.content.os}
        />
        <div
          class="sds-content my-3 text-sm text-sColor break-word"
          classList={{ [commentClassName()]: true }}
        >
          <Show when={'reply_user' in props.content && props.content.reply_user}>
            <a href={`#${props.content.pid}`}>@{props.content.reply_user!.nick}</a>
            <span>: </span>
          </Show>
          {/* eslint-disable-next-line solid/no-innerhtml */}
          <div innerHTML={props.content.comment()} />
        </div>
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
