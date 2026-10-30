<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';
  let {
    children,
    primary = false,
    ...props
  }: HTMLButtonAttributes & { children?: Snippet; primary?: boolean } = $props();
</script>

<button
  type="button"
  class={[
    'inline-block min-w-[2.5em] px-[1em] py-[0.5em] border border-solid rounded-[0.5em] text-[0.75em] leading-[1.5] text-center cursor-pointer touch-manipulation [transition:0.4s]',
    primary
      ? 'border-sTheme bg-sTheme text-sWhite enabled:hover:border-sActive enabled:hover:bg-sActive'
      : 'border-sBorder bg-transparent text-sColor enabled:hover:border-sTheme enabled:hover:text-sTheme',
    'disabled:border-sBorder disabled:bg-sDisableBg disabled:text-sDisable disabled:cursor-not-allowed',
  ]}
  {...props}
  >{#if children}{@render children()}{/if}</button
>
