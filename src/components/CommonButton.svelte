<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';
  let {
    children,
    primary = false,
    ...props
  }: HTMLButtonAttributes & { children?: Snippet; primary?: boolean } = $props();
</script>

<button type="button" class="sds-button" class:primary {...props}
  >{#if children}{@render children()}{/if}</button
>
