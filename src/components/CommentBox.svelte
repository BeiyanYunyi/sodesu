<script lang="ts">
  import { onDestroy } from 'svelte';
  import { useApp, type EditorState, type ReplyTarget } from '../state/app.svelte';
  import CommonButton from './CommonButton.svelte';
  import CloseIcon from './CloseIcon.svelte';
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
    <div class="mt-[0.75em] max-w-20 text-center sds-comment [--sds-avatar-real-size:var(--sds-avatar-size)] [&:where(.sds-comment_*)]:[--sds-avatar-real-size:var(--sds-m-avatar-size)] max-[720px]:[--sds-avatar-real-size:var(--sds-m-avatar-size)]">
      <button
        type="button"
        title={locale.profile}
        class="cursor-pointer border-none bg-transparent"
        onclick={app.openProfile}
        ><img src={model.user.avatar} alt={locale.profile} class="sds-avatar rounded-[var(--sds-avatar-radius)] shadow-[var(--sds-box-shadow)] w-[var(--sds-avatar-real-size)] h-[var(--sds-avatar-real-size)]" /></button
      >
      <button
        type="button"
        class="block max-w-20 cursor-pointer break-all border-none bg-transparent text-[0.75em] text-sTheme"
        onclick={app.openProfile}>{model.user.display_name}</button
      >
    </div>
  {/if}
  <form
    class="min-w-0 w-full m-[0.5em] [border:var(--sds-border)] border-sBorder rounded-[0.75em] bg-sBg shadow-[var(--sds-box-shadow)]"
    onsubmit={(event) => {
      event.preventDefault();
      void submit();
    }}
  >
    {#if config.login !== 'force' && config.meta.length && !model.user?.token}
      <div class="flex overflow-hidden px-1 bb-2 rounded-t-[0.75em] max-[580px]:block">
        {#each config.meta as kind}
          <div class="max-[580px]:[&:not(:last-child)]:bb-2 min-w-0 flex flex-1">
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
      class="block resize-y w-[calc(100%-1em)] min-h-[8.75em] mx-[0.5em] my-[0.75em] border-none rounded-[0.5em] bg-transparent text-sColor text-[0.875em] outline-none [transition:background_0.25s] focus:bg-sBgLight disabled:cursor-not-allowed"
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
    {#if editor.error}<div role="alert" class="mx-[0.5em] my-[1em] px-[1em] py-[0.5em] border border-dashed border-sWarning rounded-5px bg-sWarningBg text-sWarning text-[0.875em]">{editor.error}</div>{/if}
    {#if editor.showPreview}
      <div class="px-[0.5em] pb-[0.5em]">
        <hr />
        <h4 class="m-[0.25em] text-[0.9375em] font-bold">{locale.preview}</h4>
        {#if previewError}<p role="alert">{previewError}</p>{/if}
        <div class={config.commentClassName || 'sds-content'}>{@html preview}</div>
      </div>
    {/if}
    <div class="mx-[0.75em] my-[0.5em] flex flex-wrap gap-2">
      <div class="flex flex-grow-2 items-center">
        <a
          title="Markdown Guide"
          aria-label="Markdown is supported"
          rel="noopener noreferrer"
          href="https://guides.github.com/features/mastering-markdown/"
          class="inline-flex items-center justify-center w-[1.5em] h-[1.5em] m-0.5 p-0 border-none bg-transparent text-sColor text-16px cursor-pointer hover:text-sTheme disabled:cursor-not-allowed"><MarkdownIcon /></a
        >
        <button
          type="button"
          class="inline-flex items-center justify-center w-[1.5em] h-[1.5em] m-0.5 p-0 border-none bg-transparent text-sColor text-16px cursor-pointer hover:text-sTheme disabled:cursor-not-allowed"
          class:text-sActive={editor.showPreview}
          title={locale.preview}
          aria-pressed={editor.showPreview}
          onclick={() => {
            editor.showPreview = !editor.showPreview;
          }}><PreviewIcon /></button
        >
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
  {#if reply}
    <button
      type="button"
      class="absolute end-[-4px] top-[-4px] p-0 border-none bg-transparent leading-none cursor-pointer"
      title={locale.cancelReply}
      aria-label={locale.cancelReply}
      onclick={() => onclose?.()}><CloseIcon /></button
    >
  {/if}
</div>
