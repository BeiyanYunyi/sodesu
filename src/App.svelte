<script lang="ts">
  import { onMount, setContext, untrack } from 'svelte';
  import type SodesuInitOptions from './types/SodesuInitOptions';
  import { version } from '../package.json';
  import { APP_CONTEXT, createAppState, sortKeys } from './state/app.svelte';
  import { commentCount } from './vendor/waline/comment';
  import { pageviewCount } from './vendor/waline/pageview';
  import getDarkStyle from './utils/getDarkStyle';
  import CommentBox from './components/CommentBox.svelte';
  import CommentCard from './components/CommentCard.svelte';
  import CommonButton from './components/CommonButton.svelte';
  import LoadingIcon from './components/LoadingIcon.svelte';

  let props: Omit<SodesuInitOptions, 'el'> = $props();
  let overrides = $state<Partial<Omit<SodesuInitOptions, 'el'>>>({});
  const options = $derived({
    ...props,
    ...overrides,
    path:
      overrides.path ?? props.path ?? (typeof location === 'undefined' ? '/' : location.pathname),
  });
  if (!untrack(() => props.serverURL)) throw new Error("Option 'serverURL' is missing!");
  const id = $props.id();
  const app = createAppState(() => options, id);
  setContext(APP_CONTEXT, app);
  const model = app.state;
  const config = $derived(app.config);
  const locale = $derived(config.locale);
  const darkStyle = $derived(getDarkStyle(config.dark, `[data-sodesu="${id}"]`));
  onMount(app.start);
  $effect(() => {
    const style = document.createElement('style');
    style.textContent = darkStyle;
    document.head.append(style);
    return () => style.remove();
  });
  export function update(next: Partial<Omit<SodesuInitOptions, 'el'>>) {
    overrides = { ...overrides, ...next };
  }
  const requestKey = $derived(
    JSON.stringify([
      config.serverURL,
      config.path,
      config.lang,
      config.pageSize,
      config.commentSorting,
    ]),
  );
  $effect(() => {
    void requestKey;
    untrack(() => {
      model.sorting = config.commentSorting;
      void app.refresh(true);
    });
  });
  const countKey = $derived(
    JSON.stringify([config.serverURL, config.path, config.lang, options.comment]),
  );
  $effect(() => {
    const [serverURL, path, lang, option] = JSON.parse(countKey) as [
      string,
      string,
      string,
      SodesuInitOptions['comment'],
    ];
    if (option)
      return commentCount({
        serverURL,
        path,
        lang,
        selector: typeof option === 'string' ? option : undefined,
      });
  });
  const pageviewKey = $derived(
    JSON.stringify([config.serverURL, config.path, config.lang, options.pageview]),
  );
  $effect(() => {
    const [serverURL, path, lang, option] = JSON.parse(pageviewKey) as [
      string,
      string,
      string,
      SodesuInitOptions['pageview'],
    ];
    if (option)
      return pageviewCount({
        serverURL,
        path,
        lang,
        selector: typeof option === 'string' ? option : undefined,
      });
  });
  $effect(() => {
    if (config.noCopyright)
      console.info(
        `Comment system powered by Sodesu v${version}, source code: https://github.com/BeiyanYunyi/sodesu`,
      );
  });
</script>

<div class="sds-root text-[length:var(--sds-font-size)] leading-[1.75] text-start font-sans text-sColor" data-sodesu={id}>
  {#key model.editorRevision}<CommentBox />{/key}
  {#if model.error}<div role="alert" class="mx-[0.5em] my-[1em] px-[1em] py-[0.5em] border border-dashed border-sWarning rounded-5px bg-sWarningBg text-sWarning text-[0.875em]">{model.error}</div>{/if}
  <div class="flex items-center p-[0.375em]">
    <div class="flex-1 text-[1.25em] font-bold">{model.count || ''} {locale.comment}</div>
    <ul class="m-0 list-none p-0">
      {#each Object.keys(sortKeys) as key}
        {@const sort = key as keyof typeof sortKeys}
        <li class="ms-[1em] inline-block">
          <button
            type="button"
            class="cursor-pointer border-none bg-transparent p-0 text-[0.75em] hover:text-sActive"
            class:text-sTheme={model.sorting === sort}
            class:text-sInfo={model.sorting !== sort}
            aria-pressed={model.sorting === sort}
            onclick={() => {
              model.sorting = sort;
              void app.refresh();
            }}>{locale[sort]}</button
          >
        </li>
      {/each}
    </ul>
  </div>
  <div aria-busy={model.status === 'loading'}>
    {#each model.data as comment (comment.objectId)}<CommentCard
        {comment}
        rootId={comment.objectId}
      />{/each}
  </div>
  <div class="py-[1em] text-center" aria-live="polite">
    {#if model.status === 'error'}<CommonButton onclick={() => app.load(model.page + 1)}
        >{locale.refresh}</CommonButton
      >
    {:else if model.status === 'loading'}<div
        class="flex justify-center text-sInfo"
        role="status"
        aria-label="Loading"
      >
        <LoadingIcon size={30} />
      </div>
    {:else if !model.data.length}<div class="p-[1.25em]">{locale.sofa}</div>
    {:else if model.page < model.totalPages}<CommonButton onclick={() => app.load(model.page + 1)}
        >{locale.more}</CommonButton
      >{/if}
  </div>
  <div class="py-[0.5em] text-end text-sLightGrey text-info" class:hidden={config.noCopyright}>
    Powered by <a
      href="https://github.com/BeiyanYunyi/sodesu"
      target="_blank"
      rel="noopener noreferrer">Sodesu</a
    >
    v{version}
  </div>
</div>
