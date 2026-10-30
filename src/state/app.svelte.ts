import { getContext } from 'svelte';
import { addComment, getComment, updateComment } from '@waline/api';
import type { UserInfo, WalineComment, WalineCommentData } from '@waline/api';
import { starkdown } from 'starkdown';
import type SodesuInitOptions from '../types/SodesuInitOptions';
import { getConfig } from '../vendor/waline/utils/config';
import { getWordNumber } from '../vendor/waline/utils/wordCount';

export const APP_CONTEXT = Symbol('sodesu');
export const sortKeys = {
  latest: 'insertedAt_desc',
  oldest: 'insertedAt_asc',
  hottest: 'like_desc',
} as const;
export type Comment = Omit<WalineComment, 'children'> & {
  children?: Comment[];
  time?: number;
  sticky?: boolean;
  pid?: number;
  rid?: number;
  reply_user?: { nick: string; link: string; avatar: string };
};

export interface ReplyTarget {
  id: number;
  rootId: number;
  nick: string;
}
export interface EditorState {
  content: string;
  showPreview: boolean;
  submitting: boolean;
  error: string;
  active: boolean;
}

function readStored<T>(key: string, fallback: T): T {
  try {
    return (
      JSON.parse(sessionStorage.getItem(key) || localStorage.getItem(key) || 'null') ?? fallback
    );
  } catch {
    return fallback;
  }
}
function persist(key: string, value: unknown, remember = true) {
  try {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
    if (value !== null)
      (remember ? localStorage : sessionStorage).setItem(key, JSON.stringify(value));
  } catch {
    /* Storage can be unavailable in embedded browsers. */
  }
}

/** All mutable state and requests belong to one mounted app. */
export function createAppState(options: () => Omit<SodesuInitOptions, 'el'>, id: string) {
  const config = $derived({
    ...getConfig({ ...options(), path: options().path ?? '/' }),
    commentClassName: options().commentClassName || '',
    noCopyright: options().copyright === false || options().noCopyright === true,
    renderPreview: options().renderPreview ?? (async (text: string) => starkdown(text)),
  });
  const state = $state({
    data: [] as Comment[],
    count: 0,
    page: 0,
    totalPages: 0,
    status: 'loading' as 'loading' | 'success' | 'error',
    error: '',
    sorting: options().commentSorting ?? 'latest',
    editorRevision: 0,
    replyId: null as number | null,
    user: null as UserInfo | null,
    likes: [] as (number | string)[],
    pendingLikes: [] as number[],
    meta: { nick: '', mail: '', link: '' },
  });
  let active = true;
  let generation = 0;
  let request: AbortController | undefined;
  let profile: Window | null = null;
  let loginWindow: Window | null = null;
  const fail = (error: unknown) => {
    if (active) state.error = error instanceof Error ? error.message : String(error);
  };
  async function load(page = 1) {
    request?.abort();
    const controller = (request = new AbortController());
    const epoch = generation;
    state.status = 'loading';
    state.error = '';
    try {
      const result = await getComment({
        serverURL: config.serverURL,
        lang: config.lang,
        path: config.path,
        pageSize: config.pageSize,
        sortBy: sortKeys[state.sorting],
        page,
        signal: controller.signal,
        token: state.user?.token,
      });
      if (!active || controller.signal.aborted || epoch !== generation) return;
      state.data = page === 1 ? result.data : [...state.data, ...result.data];
      state.count = result.count;
      state.totalPages = result.totalPages;
      state.page = page;
      state.status = 'success';
    } catch (error) {
      if (!active || controller.signal.aborted || epoch !== generation) return;
      state.status = 'error';
      fail(error);
    }
  }
  function refresh(resetEditor = false) {
    generation++;
    state.replyId = null;
    state.pendingLikes = [];
    state.data = [];
    state.count = 0;
    state.page = 0;
    state.totalPages = 0;
    if (resetEditor) state.editorRevision++;
    return load();
  }
  async function submit(editor: EditorState, reply?: ReplyTarget) {
    if (
      editor.submitting ||
      !editor.content.trim() ||
      (config.login === 'force' && !state.user?.token)
    )
      return;
    const wordCount = getWordNumber(editor.content);
    if (config.wordLimit && (wordCount < config.wordLimit[0] || wordCount > config.wordLimit[1])) {
      editor.error = config.locale.wordHint
        .replace('$0', String(config.wordLimit[0]))
        .replace('$1', String(config.wordLimit[1]))
        .replace('$2', String(wordCount));
      return;
    }
    if (!state.user?.token) {
      if (config.requiredMeta.includes('nick') && !state.meta.nick.trim()) {
        editor.error = config.locale.nickError;
        return;
      }
      if (
        (config.requiredMeta.includes('mail') && !state.meta.mail) ||
        (state.meta.mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.meta.mail))
      ) {
        editor.error = config.locale.mailError;
        return;
      }
      if (config.requiredMeta.includes('link') && !state.meta.link.trim()) {
        editor.error = config.locale.link;
        return;
      }
    }
    const epoch = generation;
    const comment: WalineCommentData = {
      ...state.meta,
      comment: editor.content,
      ua: navigator.userAgent,
      url: config.path,
      nick: state.user?.display_name || state.meta.nick || config.locale.anonymous,
      mail: state.user?.email || state.meta.mail,
      link: state.user?.url || state.meta.link,
    };
    if (reply)
      Object.assign(comment, {
        pid: reply.id,
        rid: reply.rootId,
        at: reply.nick,
      });
    editor.submitting = true;
    editor.error = '';
    try {
      const result = await addComment({
        serverURL: config.serverURL,
        lang: config.lang,
        token: state.user?.token || '',
        comment,
      });
      if (!active || epoch !== generation) return;
      if (result.errmsg || !result.data) throw new Error(result.errmsg || 'Empty comment response');
      const added = result.data;
      const root = 'rid' in added && state.data.find((item) => item.objectId === added.rid);
      if (root) root.children = [...(root.children || []), added];
      else if (!('rid' in added) || !added.rid) state.data = [added, ...state.data];
      else {
        editor.content = '';
        editor.showPreview = false;
        await refresh();
        return editor.active;
      }
      state.count++;
      editor.content = '';
      editor.showPreview = false;
      return editor.active;
    } catch (error) {
      if (active && editor.active && epoch === generation)
        editor.error = error instanceof Error ? error.message : String(error);
    } finally {
      if (editor.active) editor.submitting = false;
    }
  }
  async function like(comment: Comment) {
    if (state.pendingLikes.includes(comment.objectId)) return;
    const epoch = generation;
    const liked = state.likes.includes(comment.objectId);
    state.pendingLikes.push(comment.objectId);
    try {
      const result = await updateComment({
        serverURL: config.serverURL,
        lang: config.lang,
        objectId: comment.objectId,
        token: state.user?.token || '',
        comment: { like: !liked },
      });
      if (!active || epoch !== generation) return;
      if (result.errmsg) throw new Error(result.errmsg);
      state.likes = liked
        ? state.likes.filter((id) => id !== comment.objectId)
        : [...state.likes.slice(-49), comment.objectId];
      comment.like = Math.max(0, (comment.like || 0) + (liked ? -1 : 1));
      persist('WALINE_LIKE', state.likes);
    } catch (error) {
      if (epoch === generation) fail(error);
    } finally {
      if (active && epoch === generation)
        state.pendingLikes = state.pendingLikes.filter((id) => id !== comment.objectId);
    }
  }
  function signIn() {
    const url = `${config.serverURL}/ui/login?lng=${encodeURIComponent(config.lang)}`;
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      location.href = `${url}&redirect=${encodeURIComponent(location.href)}`;
      return;
    }
    loginWindow?.close();
    loginWindow = window.open(url, '_blank', 'width=1024,height=600');
    if (!loginWindow) fail(new Error('Please allow popups to log in.'));
  }
  function signOut() {
    state.user = null;
    persist('WALINE_USER', null);
    void refresh();
  }
  function openProfile() {
    if (!state.user?.token) return;
    const query = new URLSearchParams({ lng: config.lang, token: state.user.token });
    profile = window.open(
      `${config.serverURL}/ui/profile?${query}`,
      '_blank',
      'width=800,height=800',
    );
  }
  function start() {
    const user = readStored<UserInfo | null>('WALINE_USER', null);
    state.user = user && typeof user.token === 'string' ? user : null;
    const likes = readStored<unknown>('WALINE_LIKE', []);
    state.likes = Array.isArray(likes)
      ? likes.filter((id) => typeof id === 'number' || typeof id === 'string')
      : [];
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== new URL(config.serverURL, location.href).origin) return;
      if (
        loginWindow &&
        event.source === loginWindow &&
        event.data?.type === 'userInfo' &&
        typeof event.data.data?.token === 'string'
      ) {
        const { remember, ...user } = event.data.data;
        state.user = user;
        persist('WALINE_USER', user, Boolean(remember));
        loginWindow.close();
        loginWindow = null;
        void refresh();
        return;
      }
      if (!profile || event.source !== profile || event.data?.type !== 'profile') return;
      state.user = { ...state.user, ...event.data.data };
      persist('WALINE_USER', state.user);
    };
    window.addEventListener('message', onMessage);
    return () => {
      active = false;
      generation++;
      request?.abort();
      loginWindow?.close();
      window.removeEventListener('message', onMessage);
    };
  }
  return {
    id,
    state,
    get config() {
      return config;
    },
    load,
    refresh,
    submit,
    like,
    signIn,
    signOut,
    openProfile,
    start,
  };
}
export type AppState = ReturnType<typeof createAppState>;
export const useApp = () => getContext<AppState>(APP_CONTEXT);
