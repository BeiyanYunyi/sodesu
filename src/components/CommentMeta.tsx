import { Component, Show } from 'solid-js';

const CommentMeta: Component<{ addr?: string; browser?: string; os?: string }> = (props) => (
  <div aria-hidden>
    <Show when={props.addr}>
      <span class="text-info text-sInfo bg-sInfoBg p-1 me-1 rounded">{props.addr}</span>
    </Show>
    <Show when={props.browser}>
      <span class="text-info text-sInfo bg-sInfoBg p-1 me-1 rounded">{props.browser}</span>
    </Show>
    <Show when={props.os}>
      <span class="text-info text-sInfo bg-sInfoBg p-1 me-1 rounded">{props.os}</span>
    </Show>
  </div>
);

export default CommentMeta;
