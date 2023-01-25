import { Component, Show } from 'solid-js';

const CommentMeta: Component<{ addr?: string; browser?: string; os?: string }> = (props) => (
  <div aria-hidden>
    <Show when={props.addr}>
      <span>{props.addr}</span>
    </Show>
    <Show when={props.browser}>
      <span>{props.browser}</span>
    </Show>
    <Show when={props.os}>
      <span>{props.os}</span>
    </Show>
  </div>
);

export default CommentMeta;
