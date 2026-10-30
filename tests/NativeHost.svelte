<script lang="ts">
  import App from '../src/App.svelte';
  let path = $state('/native');
  let initialData = $state({
    data: [{ objectId: 77, nick: 'Seed author', comment: '<p>Reactive seed</p>', avatar: '', like: 0, children: [] }],
    count: 1,
    totalPages: 1,
  });
</script>

<button
  onclick={() => {
    path = '/native-next';
  }}>Navigate</button
>
<App serverURL="https://comments.example" lang="en" {path} {initialData} />
