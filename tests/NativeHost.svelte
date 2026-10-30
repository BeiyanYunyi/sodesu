<script lang="ts">
  import App from '../src/App.svelte';
  let path = $state('/native');
</script>

<button
  onclick={() => {
    path = '/native-next';
  }}>Navigate</button
>
<App serverURL="https://comments.example" lang="en" {path} />
