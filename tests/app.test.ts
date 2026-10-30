import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, waitFor, within } from '@testing-library/svelte';
import { flushSync, mount, unmount } from 'svelte';
import App from '../src/App.svelte';
import NativeHost from './NativeHost.svelte';
import { init } from '../src/index';
import { getComment, addComment, updateComment } from '@waline/api';

vi.mock('@waline/api', () => ({
  getComment: vi.fn(),
  addComment: vi.fn(),
  updateComment: vi.fn(),
  login: vi.fn(),
  fetchCommentCount: vi.fn(),
  getPageview: vi.fn(),
  updatePageview: vi.fn(),
}));
const pending: ReturnType<typeof init>[] = [];
const comment = (id = 1) => ({
  objectId: id,
  nick: `User ${id}`,
  comment: '<p>Hello</p>',
  avatar: '',
  time: Date.now(),
  like: 0,
  children: [],
});
const response = (id = 1, totalPages = 1) => ({
  data: [comment(id)],
  count: 2,
  totalPages,
  page: 1,
  pageSize: 10,
});
function create(options = {}) {
  const root = document.createElement('div');
  document.body.append(root);
  const instance = init({
    el: root,
    serverURL: 'https://comments.example',
    lang: 'en',
    ...options,
  });
  pending.push(instance);
  return { root, instance, query: within(root) };
}
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.mocked(getComment).mockResolvedValue(response());
});
afterEach(async () => {
  await Promise.all(pending.splice(0).map((instance) => instance.destroy()));
  document.body.innerHTML = '';
  vi.resetAllMocks();
});

describe('Svelte app lifecycle and interactions', () => {
  it('updates native component props without sharing state', async () => {
    const target = document.createElement('div');
    document.body.append(target);
    const host = mount(NativeHost, { target });
    flushSync();
    await fireEvent.click(within(target).getByRole('button', { name: 'Navigate' }));
    await waitFor(() =>
      expect(getComment).toHaveBeenLastCalledWith(
        expect.objectContaining({ path: '/native-next' }),
      ),
    );
    await unmount(host);
  });
  it('keeps drafts and avoids requests for presentation-only updates', async () => {
    const { root, instance } = create();
    await waitFor(() => expect(root.textContent).toContain('Hello'));
    await fireEvent.input(root.querySelector('textarea')!, { target: { value: 'keep me' } });
    const calls = vi.mocked(getComment).mock.calls.length;
    instance.update({ dark: true, commentClassName: 'updated' });
    expect((root.querySelector('textarea') as HTMLTextAreaElement).value).toBe('keep me');
    expect(getComment).toHaveBeenCalledTimes(calls);
    expect(document.head.textContent).toContain('--sds-white:#000');
  });
  it('replaces default content styling in comments and previews and restores it when cleared', async () => {
    const { root, instance, query } = create({
      commentClassName: 'custom-prose custom-content',
      renderPreview: async () => '<p>Preview content</p>',
    });
    await query.findByText('Hello');
    await fireEvent.input(root.querySelector('textarea')!, { target: { value: 'draft' } });
    await fireEvent.click(query.getByRole('button', { name: 'Preview' }));
    await query.findByText('Preview content');
    const containers = [
      query.getByText('Hello').parentElement!,
      query.getByText('Preview content').parentElement!,
    ];
    for (const container of containers)
      expect(container.className).toBe('custom-prose custom-content');
    expect(root.querySelector('.sds-content')).toBeNull();
    instance.update({ commentClassName: '' });
    for (const container of containers) expect(container.className).toBe('sds-content');
    instance.update({ commentClassName: 'replacement' });
    for (const container of containers) expect(container.className).toBe('replacement');
  });
  it('trusts only the login popup and cleans it on destroy', async () => {
    const popup = { close: vi.fn() } as unknown as Window;
    const open = vi.spyOn(window, 'open').mockReturnValue(popup);
    const { instance, query } = create();
    await fireEvent.click(query.getByRole('button', { name: 'Login' }));
    const data = {
      type: 'userInfo',
      data: {
        token: 'test-token',
        display_name: 'Member',
        email: 'member@example.com',
        remember: false,
      },
    };
    window.dispatchEvent(
      new MessageEvent('message', { origin: 'https://untrusted.example', source: popup, data }),
    );
    flushSync();
    expect(query.queryByRole('button', { name: 'logout' })).toBeNull();
    window.dispatchEvent(
      new MessageEvent('message', { origin: 'https://comments.example', source: popup, data }),
    );
    flushSync();
    expect(query.getByRole('button', { name: 'logout' })).toBeTruthy();
    expect(sessionStorage.getItem('WALINE_USER')).toContain('test-token');
    expect(localStorage.getItem('WALINE_USER')).toBeNull();
    expect(popup.close).toHaveBeenCalled();
    await fireEvent.click(query.getByRole('button', { name: 'logout' }));
    await fireEvent.click(query.getByRole('button', { name: 'Login' }));
    await instance.destroy();
    expect(popup.close).toHaveBeenCalledTimes(2);
    open.mockRestore();
  });

  it('isolates configuration, drafts, sorting, and destroy between instances', async () => {
    const a = create({ path: '/a', dark: true });
    const b = create({ path: '/b' });
    await waitFor(() => expect(a.query.getByText('Hello')).toBeTruthy());
    await fireEvent.input(a.query.getByRole('textbox', { name: 'Comment here...' }), {
      target: { value: 'A draft' },
    });
    expect((b.root.querySelector('textarea') as HTMLTextAreaElement).value).toBe('');
    a.instance.update({ path: '/next', commentClassName: 'custom-class', login: 'disable' });
    await waitFor(() =>
      expect(getComment).toHaveBeenLastCalledWith(expect.objectContaining({ path: '/next' })),
    );
    expect(b.query.getByText('Hello')).toBeTruthy();
    await waitFor(() => expect(a.root.querySelector('.custom-class')).toBeTruthy());
    a.instance.update({ commentClassName: '' });
    expect(a.root.querySelector('.custom-class')).toBeNull();
    await a.instance.destroy();
    expect(a.root.innerHTML).toBe('');
    expect(b.root.querySelector('textarea')).toBeTruthy();
    expect(document.head.textContent).not.toContain('--sds-white:#000');
  });
  it('ignores stale responses after updates and aborts on destroy', async () => {
    let resolve!: (value: ReturnType<typeof response>) => void;
    vi.mocked(getComment).mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    const { root, instance } = create({ path: '/old' });
    const signal = vi.mocked(getComment).mock.calls[0][0].signal!;
    instance.update({ path: '/new' });
    expect(signal.aborted).toBe(true);
    await waitFor(() => expect(root.textContent).toContain('User 1'));
    resolve(response(99));
    await new Promise((done) => setTimeout(done, 0));
    expect(root.textContent).not.toContain('User 99');
    const lastSignal = vi.mocked(getComment).mock.lastCall![0].signal!;
    await instance.destroy();
    expect(lastSignal.aborted).toBe(true);
  });
  it('loads more and resets on sort', async () => {
    vi.mocked(getComment)
      .mockResolvedValueOnce(response(1, 2))
      .mockResolvedValueOnce(response(2, 2));
    const { query } = create();
    await fireEvent.click(await query.findByRole('button', { name: 'Load More...' }));
    await waitFor(() => expect(query.getByText('User 2')).toBeTruthy());
    expect(query.getByText('User 1')).toBeTruthy();
    await fireEvent.click(query.getByRole('button', { name: 'Oldest' }));
    await waitFor(() =>
      expect(getComment).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 1, sortBy: 'insertedAt_asc' }),
      ),
    );
  });
  it('supports anonymous likes and handles server failures without incrementing', async () => {
    vi.mocked(updateComment)
      .mockResolvedValueOnce({ errno: 1, errmsg: 'Like failed' } as never)
      .mockResolvedValueOnce({ data: comment(), errno: 0 } as never);
    const { query } = create();
    const like = await query.findByRole('button', { name: 'Like' });
    await fireEvent.click(like);
    expect(await query.findByRole('alert')).toHaveProperty('textContent', 'Like failed');
    expect(like.getAttribute('aria-pressed')).toBe('false');
    await fireEvent.click(like);
    await waitFor(() => expect(like.getAttribute('aria-pressed')).toBe('true'));
    expect(updateComment).toHaveBeenLastCalledWith(
      expect.objectContaining({ token: '', comment: { like: true } }),
    );
  });
  it('previews with starkdown and submits a reply', async () => {
    vi.mocked(addComment).mockResolvedValue({
      data: { ...comment(3), children: undefined, rid: 1, pid: 1 },
      errno: 0,
    } as never);
    const { root, query } = create({ login: 'disable' });
    await fireEvent.click(await query.findByRole('button', { name: 'Reply' }));
    const form = root.querySelector('.sds-comment form')!;
    const editor = form.querySelector('textarea')!;
    await fireEvent.input(editor, { target: { value: '**A reply**' } });
    await fireEvent.click(within(form as HTMLElement).getByRole('button', { name: 'Preview' }));
    await waitFor(() =>
      expect(root.querySelector('.sds-content strong')?.textContent).toBe('A reply'),
    );
    await fireEvent.submit(form);
    await waitFor(() =>
      expect(addComment).toHaveBeenCalledWith(
        expect.objectContaining({
          comment: expect.objectContaining({ rid: 1, pid: 1, comment: '**A reply**' }),
        }),
      ),
    );
    await waitFor(() => expect(query.getByText('User 3')).toBeTruthy());
    expect(root.querySelectorAll('textarea')).toHaveLength(1);
    expect(query.queryByRole('button', { name: 'Login' })).toBeNull();
    expect(query.queryByRole('button', { name: 'logout' })).toBeNull();
  });
  it('keeps the main draft while switching a single reply box', async () => {
    vi.mocked(getComment).mockResolvedValue({ ...response(), data: [comment(1), comment(2)] });
    const { root, query } = create();
    await waitFor(() => expect(query.getByText('User 2')).toBeTruthy());
    const main = root.querySelector('form')!;
    await fireEvent.input(main.querySelector('textarea')!, { target: { value: '**main draft**' } });
    await fireEvent.click(query.getAllByRole('button', { name: 'Reply' })[0]);
    const first = root.querySelectorAll('form')[1];
    await fireEvent.input(first.querySelector('textarea')!, {
      target: { value: '**first reply**' },
    });
    await fireEvent.click(within(first).getByRole('button', { name: 'Preview' }));
    await waitFor(() => expect(first.querySelector('strong')?.textContent).toBe('first reply'));
    expect(main.querySelector('strong')).toBeNull();
    await fireEvent.click(query.getByRole('button', { name: 'Reply' }));
    expect(root.contains(first)).toBe(false);
    const forms = root.querySelectorAll('form');
    expect(forms).toHaveLength(2);
    expect(forms[1].querySelector('textarea')!.placeholder).toBe('@User 2');
    expect(forms[1].querySelector('textarea')!.value).toBe('');
    expect(forms[1].querySelector('strong')).toBeNull();
    expect(main.querySelector('textarea')!.value).toBe('**main draft**');
    await fireEvent.click(within(forms[1].parentElement!).getByRole('button', { name: 'Cancel reply' }));
    expect(root.querySelectorAll('textarea')).toHaveLength(1);
    expect(main.querySelector('textarea')!.value).toBe('**main draft**');
  });
  it('submits main and reply independently without mixing targets or errors', async () => {
    const complete: ((result: unknown) => void)[] = [];
    vi.mocked(addComment).mockImplementation(
      () => new Promise((resolve) => complete.push(resolve as (result: unknown) => void)),
    );
    const { root, query } = create();
    await fireEvent.click(await query.findByRole('button', { name: 'Reply' }));
    const [main, reply] = root.querySelectorAll('form');
    await fireEvent.input(main.querySelector('textarea')!, { target: { value: 'main draft' } });
    await fireEvent.input(reply.querySelector('textarea')!, { target: { value: 'reply draft' } });
    await fireEvent.submit(reply);
    expect(reply.querySelector('button[type=submit]')).toHaveProperty('disabled', true);
    expect(main.querySelector('button[type=submit]')).toHaveProperty('disabled', false);
    await fireEvent.submit(main);
    expect(vi.mocked(addComment).mock.calls[0][0].comment).toEqual(
      expect.objectContaining({ comment: 'reply draft', pid: 1, rid: 1, at: 'User 1' }),
    );
    expect(vi.mocked(addComment).mock.calls[1][0].comment).toEqual(
      expect.objectContaining({ comment: 'main draft' }),
    );
    expect(vi.mocked(addComment).mock.calls[1][0].comment).not.toHaveProperty('pid');
    complete[0]({
      errno: 0,
      data: { ...comment(3), rid: 1, pid: 1, comment: '<p>reply saved</p>' },
    });
    await waitFor(() => expect(root.contains(reply)).toBe(false));
    expect(query.getByText('reply saved')).toBeTruthy();
    expect(root.contains(main)).toBe(true);
    complete[1]({ errno: 1, errmsg: 'Submit failed' });
    await waitFor(() => expect(within(main).getByRole('alert').textContent).toBe('Submit failed'));
    expect(main.querySelector('textarea')!.value).toBe('main draft');
  });
  it('does not close a reopened editor when a cancelled submission completes', async () => {
    let finish!: (result: unknown) => void;
    vi.mocked(addComment).mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve as (result: unknown) => void;
        }),
    );
    const { root, query } = create();
    await fireEvent.click(await query.findByRole('button', { name: 'Reply' }));
    const first = root.querySelector('.sds-comment form')!;
    await fireEvent.input(first.querySelector('textarea')!, { target: { value: 'old reply' } });
    await fireEvent.submit(first);
    await fireEvent.click(within(first.parentElement!).getByRole('button', { name: 'Cancel reply' }));
    await fireEvent.click(query.getByRole('button', { name: 'Reply' }));
    const reopened = root.querySelector('.sds-comment form')!;
    await fireEvent.input(reopened.querySelector('textarea')!, { target: { value: 'new draft' } });
    finish({ errno: 0, data: { ...comment(3), rid: 1, pid: 1 } });
    await waitFor(() => expect(query.getByText('User 3')).toBeTruthy());
    expect(root.contains(reopened)).toBe(true);
    expect(reopened.querySelector('textarea')!.value).toBe('new draft');
  });
  it('resets all editors on path change and ignores old submissions', async () => {
    let finish!: (result: unknown) => void;
    vi.mocked(addComment).mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve as (result: unknown) => void;
        }),
    );
    const { root, query, instance } = create();
    await fireEvent.click(await query.findByRole('button', { name: 'Reply' }));
    const forms = root.querySelectorAll('form');
    for (const form of forms)
      await fireEvent.input(form.querySelector('textarea')!, {
        target: { value: 'old page draft' },
      });
    await fireEvent.submit(forms[1]);
    instance.update({ path: '/new-page' });
    finish({ errno: 0, data: { ...comment(99), rid: 1, pid: 1 } });
    await waitFor(() => expect(query.getByText('User 1')).toBeTruthy());
    expect(root.querySelectorAll('textarea')).toHaveLength(1);
    expect(root.querySelector('textarea')!.value).toBe('');
    expect(query.queryByText('User 99')).toBeNull();
  });
  it('keeps the newest custom preview and rejects invalid word limits', async () => {
    const resolvers: ((html: string) => void)[] = [];
    const renderPreview = vi.fn(() => new Promise<string>((resolve) => resolvers.push(resolve)));
    const { root, query } = create({ renderPreview, wordLimit: [2, 3] });
    const editor = root.querySelector('textarea')!;
    await fireEvent.input(editor, { target: { value: 'one' } });
    await fireEvent.click(query.getByRole('button', { name: 'Preview' }));
    await waitFor(() => expect(resolvers).toHaveLength(1));
    await fireEvent.input(editor, { target: { value: 'two' } });
    await waitFor(() => expect(resolvers).toHaveLength(2));
    resolvers[1]('<b>new</b>');
    resolvers[0]('<b>old</b>');
    await waitFor(() => expect(root.querySelector('.sds-content b')?.textContent).toBe('new'));
    await fireEvent.submit(root.querySelector('form')!);
    expect(addComment).not.toHaveBeenCalled();
    expect(query.getByRole('alert')).toBeTruthy();
  });
  it('cleans listeners and supports reactive native component props', async () => {
    const remove = vi.spyOn(window, 'removeEventListener');
    const { instance } = create();
    await instance.destroy();
    expect(remove).toHaveBeenCalledWith('message', expect.any(Function));
    remove.mockRestore();
    const target = document.createElement('div');
    document.body.append(target);
    const app = mount(App, {
      target,
      props: { serverURL: 'https://comments.example', path: '/native' },
    });
    flushSync();
    app.update({ path: '/updated' });
    flushSync();
    await waitFor(() =>
      expect(getComment).toHaveBeenLastCalledWith(expect.objectContaining({ path: '/updated' })),
    );
    await unmount(app);
  });
});
