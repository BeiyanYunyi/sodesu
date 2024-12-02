import { type Component, Show } from 'solid-js';

const CommentMeta: Component<{ addr?: string; browser?: string; os?: string }> = props => (
  <div aria-hidden>
    <Show when={props.addr}>
      <span class="me-1 rounded bg-sInfoBg p-1 text-sInfo text-info">{props.addr}</span>
    </Show>
    <Show when={props.browser}>
      <span class="me-1 rounded bg-sInfoBg p-1 text-sInfo text-info">{props.browser}</span>
    </Show>
    <Show when={props.os}>
      <span class="me-1 rounded bg-sInfoBg p-1 text-sInfo text-info">{props.os}</span>
    </Show>
  </div>
);

export default CommentMeta;
