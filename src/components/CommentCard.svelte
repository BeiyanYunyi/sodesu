<script lang="ts">
  import { onMount } from 'svelte';
  import { useApp, type Comment } from '../state/app.svelte';
  import { getTimeAgo } from '../vendor/waline/utils/date';
  import CommentCard from './CommentCard.svelte';
  import CommentBox from './CommentBox.svelte';
  import LikeIcon from './LikeIcon.svelte';
  import ReplyIcon from './ReplyIcon.svelte';
  import VerifiedIcon from './VerifiedIcon.svelte';
  let { comment, rootId }: { comment: Comment; rootId: number } = $props();
  const app = useApp();
  const model = app.state;
  const locale = $derived(app.config.locale);
  const liked = $derived(model.likes.includes(comment.objectId));
  const link = $derived(safeLink(comment.link));
  const replying = $derived(model.replyId === comment.objectId);
  let now = $state(new Date());
  onMount(() => {
    const timer = setInterval(() => {
      now = new Date();
    }, 60_000);
    return () => clearInterval(timer);
  });
  function safeLink(link?: string) {
    if (!link) return '';
    try {
      const url = new URL(/^[\w+.-]+:/.test(link) ? link : `https://${link}`);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch {
      return '';
    }
  }
</script>

<div
  id={`sds-${app.id}-${rootId}-${comment.objectId}`}
  class="sds-comment relative flex p-[0.5em] pe-0"
>
  <div aria-hidden="true" class="relative me-[0.75em] shrink-0">
    {#if comment.avatar}<img
        class="sds-avatar"
        src={comment.avatar}
        alt={comment.nick}
      />{#if comment.type}<VerifiedIcon />{/if}{/if}
  </div>
  <div class="sds-comment-card min-w-0 flex-1 pb-[0.5em] bb-1">
    <div class="overflow-hidden leading-[1.5]">
      {#if link}<a
          class="me-[0.5em] inline-block text-[0.875em] font-bold"
          href={link}
          target="_blank"
          rel="noopener noreferrer">{comment.nick}</a
        >
      {:else}<span class="me-[0.5em] inline-block text-[0.875em] text-sDarkGrey font-bold"
          >{comment.nick}</span
        >{/if}
      {#each [comment.type === 'administrator' ? locale.admin : '', comment.label, comment.sticky ? locale.sticky : '', comment.level !== undefined && comment.level >= 0 ? locale[`level${comment.level}`] || `Level ${comment.level}` : ''].filter(Boolean) as badge}
        <span
          class="me-[1em] inline-block border border-sBadge rounded border-solid px-[0.3em] text-sBadge text-badge"
          >{badge}</span
        >
      {/each}
      <span class="me-[0.875em] text-[0.75em] text-sInfo"
        >{getTimeAgo(new Date(comment.time || 0), now, locale)}</span
      >
      <div class="sds-comment-actions float-right inline-flex items-center">
        <button
          type="button"
          class="sds-action w-auto!"
          aria-label={liked ? locale.cancelLike : locale.like}
          title={liked ? locale.cancelLike : locale.like}
          aria-pressed={liked}
          disabled={model.pendingLikes.includes(comment.objectId)}
          onclick={() => app.like(comment)}
          ><LikeIcon active={liked} /><span>{comment.like || 0}</span></button
        >
        <button
          type="button"
          class="sds-action"
          title={replying ? locale.cancelReply : locale.reply}
          onclick={() => {
            model.replyId = replying ? null : comment.objectId;
          }}><ReplyIcon /></button
        >
      </div>
    </div>
    <div aria-hidden="true" class="leading-none">
      {#each [comment.addr, comment.browser, comment.os].filter(Boolean) as meta}<span
          class="me-[0.25em] inline-block rounded bg-sInfoBg px-1 py-0.5 text-sInfo text-info leading-[1.5]"
          >{meta}</span
        >{/each}
    </div>
    <div class={`sds-content ${app.config.commentClassName}`}>
      {#if 'reply_user' in comment && comment.reply_user}<a
          href={`#sds-${app.id}-${rootId}-${comment.pid}`}>@{comment.reply_user.nick}</a
        >:
      {/if}
      {@html comment.comment}
    </div>
    {#if replying}<CommentBox
        reply={{ id: comment.objectId, rootId, nick: comment.nick }}
        onclose={() => {
          if (model.replyId === comment.objectId) model.replyId = null;
        }}
      />{/if}
    {#each comment.children || [] as child (child.objectId)}<CommentCard
        comment={child}
        {rootId}
      />{/each}
  </div>
</div>
