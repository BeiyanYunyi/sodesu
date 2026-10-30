import assert from 'node:assert/strict';
import { createServer } from 'vite';

// Exercise the package's source export through the downstream Svelte SSR pipeline.
const server = await createServer({ server: { middlewareMode: true } });
try {
  const { default: Component } = await server.ssrLoadModule('sodesu-comment/component');
  const { render } = await server.ssrLoadModule('svelte/server');
  const initialData = {
    data: [
      {
        objectId: 42,
        nick: 'SSR author',
        comment: '<p>Server-rendered comment</p>',
        avatar: '',
        time: 0,
        like: 0,
        children: [
          {
            objectId: 43,
            nick: 'Reply author',
            comment: '<p>Nested reply</p>',
            avatar: '',
            time: 0,
            like: 0,
          },
        ],
      },
    ],
    count: 2,
    totalPages: 2,
  };
  const props = { serverURL: 'https://comments.example', path: '/ssr', lang: 'en', initialData };
  const { body } = render(Component, { props });
  assert.ok(body.includes('Server-rendered comment'));
  assert.ok(body.includes('Nested reply'));
  assert.ok(body.includes('SSR author'));
  assert.ok(body.includes('Load More...'));
  assert.ok(body.includes('aria-busy="false"'));
  const empty = render(Component, {
    props: { ...props, initialData: { data: [], count: 0, totalPages: 0 } },
  });
  assert.ok(!empty.body.includes('Server-rendered comment'));
  assert.ok(empty.body.includes('aria-busy="false"'));
  console.log(
    'SSR package resolution, initial comments, replies, pagination and instance isolation verified.',
  );
} finally {
  await server.close();
}
