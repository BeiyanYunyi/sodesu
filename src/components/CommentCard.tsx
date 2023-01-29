import { createDateNow } from '@solid-primitives/date';
import { Component, createMemo, Index, Show } from 'solid-js';
import type { ReactiveComment } from '../controllers/commentListState';
import configProvider from '../controllers/configProvider';
import { getTimeAgo } from '../waline/utils/date';
import { isLinkHttp } from '../waline/utils/path';
import CommentCardActions from './CommentCardActions';
import CommentMeta from './CommentMeta';

const CommentCard: Component<{ content: ReactiveComment }> = (props) => {
  const link = createMemo(() => {
    const { link: link2 } = props.content;
    if (!link2) return '';
    return isLinkHttp(link2) ? link2 : `https://${link2}`;
  });
  const [now] = createDateNow();
  const { locale } = configProvider;
  const time = createMemo(() => getTimeAgo(props.content.insertedAt, now(), locale()));
  return (
    <div id={props.content.objectId} class="sds-comment flex p-2">
      <div aria-hidden class="me-3">
        <Show when={props.content.avatar}>
          <img src={props.content.avatar} alt="A user's avatar" class="sds-avatar" />
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
            <span class="inline-block me-3 p-1 border border-solid border-sBadge text-badge text-sBadge rounded-1">
              {locale().admin}
            </span>
          </Show>
          <Show when={props.content.label}>
            <span class="inline-block me-3 p-1 border border-solid border-sBadge text-badge text-sBadge rounded-1">
              {props.content.label}
            </span>
          </Show>
          <Show when={props.content.sticky}>
            <span class="inline-block me-3 p-1 border border-solid border-sBadge text-badge text-sBadge rounded-1">
              {locale().sticky}
            </span>
          </Show>
          <Show when={props.content.level !== undefined && props.content.level >= 0}>
            <span class="inline-block me-3 p-1 border border-solid border-sBadge text-badge text-sBadge rounded-1">
              {locale()[`level${props.content.level!}`] || `Level ${props.content.level}`}
            </span>
          </Show>
          <span class="me-3 text-sInfo text-xs">{time()}</span>
          <CommentCardActions comment={props.content} />
        </div>
        <CommentMeta
          addr={props.content.addr}
          browser={props.content.browser}
          os={props.content.os}
        />
        {/* eslint-disable-next-line solid/no-innerhtml */}
        <div class="my-3 text-sm break-word text-sColor" innerHTML={props.content.comment} />
        <Show when={props.content.children}>
          <Index each={props.content.children()}>
            {(item) => <CommentCard content={item()} />}
          </Index>
        </Show>
      </div>
    </div>
  );
};

export default CommentCard;
