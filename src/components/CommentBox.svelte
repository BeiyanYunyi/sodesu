<script lang="ts">
  import { onDestroy } from 'svelte';
  import { useApp, type EditorState, type ReplyTarget } from '../state/app.svelte';
  import CommonButton from './CommonButton.svelte';
  import LoadingIcon from './LoadingIcon.svelte';
  import MarkdownIcon from './MarkdownIcon.svelte';
  import PreviewIcon from './PreviewIcon.svelte';
  let { reply, onclose }: { reply?: ReplyTarget; onclose?: () => void } = $props();
  const editor: EditorState = $state({
    content: '',
    showPreview: false,
    submitting: false,
    error: '',
    active: true,
  });
  onDestroy(() => {
    editor.active = false;
  });
  async function submit() {
    if (await app.submit(editor, reply)) onclose?.();
  }
  const app = useApp();
  const model = app.state;
  const config = $derived(app.config);
  const locale = $derived(config.locale);
  const id = $props.id();
  let preview = $state('');
  let previewError = $state('');
  $effect(() => {
    const text = editor.content;
    const render = config.renderPreview;
    if (!editor.showPreview) {
      preview = '';
      return;
    }
    let current = true;
    previewError = '';
    Promise.resolve()
      .then(() => render(text))
      .then(
        (html) => {
          if (current) preview = html;
        },
        (error) => {
          if (current) previewError = String(error);
        },
      );
    return () => {
      current = false;
    };
  });
</script>

<div class="relative mb-[0.75em] flex">
  {#if config.login !== 'disable' && model.user?.token}
    <div class="mt-[0.75em] max-w-20 text-center sds-comment">
      <button
        type="button"
        title={locale.profile}
        class="cursor-pointer border-none bg-transparent"
        onclick={app.openProfile}
        ><img src={model.user.avatar} alt={locale.profile} class="sds-avatar" /></button
      >
      <button
        type="button"
        class="block max-w-20 cursor-pointer break-all border-none bg-transparent text-[0.75em] text-sTheme"
        onclick={app.openProfile}>{model.user.display_name}</button
      >
    </div>
  {/if}
  <form
    class="sds-panel"
    onsubmit={(event) => {
      event.preventDefault();
      void submit();
    }}
  >
    {#if config.login !== 'force' && config.meta.length && !model.user?.token}
      <div class="sds-header">
        {#each config.meta as kind}
          <div class="sds-header-item min-w-0 flex flex-1">
            <label
              for={`${id}-${kind}`}
              class="min-w-10 px-[0.5em] py-[0.75em] text-center text-[0.75em]"
              >{locale[kind]}{config.requiredMeta.length && !config.requiredMeta.includes(kind)
                ? `(${locale.optional})`
                : ''}</label
            >
            <input
              id={`${id}-${kind}`}
              type={kind === 'mail' ? 'email' : 'text'}
              required={config.requiredMeta.includes(kind)}
              autocomplete={kind === 'nick' ? 'nickname' : kind === 'mail' ? 'email' : 'url'}
              class="min-w-0 w-0 flex-1 border-none bg-transparent p-[0.5em] text-[0.625em] text-sColor outline-none focus:bg-sBgLight"
              bind:value={model.meta[kind]}
            />
          </div>
        {/each}
      </div>
    {/if}
    <textarea
      class="sds-editor"
      aria-label={locale.placeholder}
      placeholder={reply ? `@${reply.nick}` : locale.placeholder}
      bind:value={editor.content}
      required
      disabled={editor.submitting || (config.login === 'force' && !model.user?.token)}
      onkeydown={(event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
          event.preventDefault();
          event.currentTarget.form?.requestSubmit();
        }
      }}></textarea>
    {#if editor.error}<div role="alert" class="sds-warning">{editor.error}</div>{/if}
    {#if editor.showPreview}
      <div class="px-[0.5em] pb-[0.5em]">
        <hr />
        <h4 class="m-[0.25em] text-[0.9375em] font-bold">{locale.preview}</h4>
        {#if previewError}<p role="alert">{previewError}</p>{/if}
        <div class={`sds-content ${config.commentClassName}`}>{@html preview}</div>
      </div>
    {/if}
    <div class="mx-[0.75em] my-[0.5em] flex flex-wrap gap-2">
      <div class="flex flex-grow-2 items-center">
        <a
          title="Markdown Guide"
          aria-label="Markdown is supported"
          rel="noopener noreferrer"
          href="https://guides.github.com/features/mastering-markdown/"
          class="sds-action"><MarkdownIcon /></a
        >
        <button
          type="button"
          class="sds-action"
          class:text-sActive={editor.showPreview}
          title={locale.preview}
          aria-pressed={editor.showPreview}
          onclick={() => {
            editor.showPreview = !editor.showPreview;
          }}><PreviewIcon /></button
        >
        {#if reply}<button
            type="button"
            class="sds-action w-auto!"
            onclick={() => {
              onclose?.();
            }}>{locale.cancelReply}</button
          >{/if}
      </div>
      <div class="flex flex-grow-3 items-center justify-end gap-[0.75em]">
        {#if config.login !== 'disable'}
          {#if model.user?.token}<CommonButton onclick={app.signOut}>{locale.logout}</CommonButton>
          {:else}<CommonButton onclick={app.signIn}>{locale.login}</CommonButton>{/if}
        {/if}
        {#if config.login !== 'force' || model.user?.token}
          <CommonButton type="submit" primary disabled={editor.submitting}
            >{#if editor.submitting}<LoadingIcon
                size={16}
              />{:else}{locale.submit}{/if}</CommonButton
          >
        {/if}
      </div>
    </div>
  </form>
</div>
