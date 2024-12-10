import type { WalineComment, WalineCommentStatus } from '@waline/api';
import type { WalineCommentSorting } from '@waline/client';
import { getComment } from '@waline/api';
import { type Accessor, createRoot, createSignal, type Setter } from 'solid-js';
import configProvider from './configProvider';

import userInfoState from './userInfoState';

type SortKey = 'insertedAt_desc' | 'insertedAt_asc' | 'like_desc';

const sortKeyMap: Record<WalineCommentSorting, SortKey> = {
  latest: 'insertedAt_desc',
  oldest: 'insertedAt_asc',
  hottest: 'like_desc',
};

export const sortingMethods = Object.keys(sortKeyMap) as WalineCommentSorting[];

interface ReactiveCommentData {
  /**
   * User Nickname
   */
  nick: string;
  /**
   * User link
   */
  link?: string;
  /**
   * Content of comment
   */
  comment: Accessor<string>;
  /**
   * Parent comment id
   */
  pid?: string;
  /**
   * Root comment id
   */
  rid?: string;
  /**
   * User id being at
   */
  at?: string;
  /**
   * Recaptcha Token
   */
  recaptchaV3?: string;
}

export interface ReactiveComment extends Exclude<ReactiveCommentData, 'ua'> {
  avatar: string;
  /**
   * User type
   */
  type?: 'administrator' | 'guest' | `verify:${string}`;
  objectId: string;
  /**
   * Time ISOString when the comment is created
   */
  children: Accessor<ReactiveComment[]>;
  sticky?: boolean;
  browser?: string;
  os?: string;
  level?: number;
  addr?: string;
  label?: string;
  time: number;
  user_id?: string | number;
  status?: WalineCommentStatus;
  like: Accessor<number>;
  orig: Accessor<string | undefined>;
  setLike: Setter<number>;
  setChildren: Setter<ReactiveComment[]>;
  setComment: Setter<string>;
  setOrig: Setter<string>;
}

export function makeDataReactive(data: WalineComment): ReactiveComment {
  const [children, setChildren] = createSignal(
    makeDatasReactive('children' in data ? data.children : []),
  );
  const [like, setLike] = createSignal(data.like || 0);
  const [comment, setComment] = createSignal(data.comment);
  const [orig, setOrig] = createSignal(data.orig);
  return {
    ...data,
    time: (data as unknown as { time: number }).time,
    children,
    setChildren,
    like,
    setLike,
    comment,
    setComment,
    orig,
    setOrig,
  };
}

export function makeDatasReactive(datas: WalineComment[]) {
  return datas.map(data => makeDataReactive(data));
}

const commentListState = createRoot(() => {
  const { config } = configProvider;
  const [status, setStatus] = createSignal<'loading' | 'success' | 'error'>('loading');
  const [sorting, setSorting] = createSignal(config().commentSorting);
  const [page, setPage] = createSignal(1);
  const [count, setCount] = createSignal(1);
  const [data, setData] = createSignal<ReactiveComment[]>([]);
  const [totalPages, setTotalPages] = createSignal(0);
  return {
    status,
    sorting,
    page,
    count,
    data,
    totalPages,
    setStatus,
    setSorting,
    setPage,
    setCount,
    setData,
    setTotalPages,
  };
});

let abort: () => void;

export function getCommentData(page: number) {
  const { sorting, setStatus, setCount, setData, setPage, setTotalPages } = commentListState;
  const { config } = configProvider;
  const { userInfo } = userInfoState;
  const controller = new AbortController();
  setStatus('loading');
  abort?.();
  getComment({
    serverURL: config().serverURL,
    lang: config().lang,
    path: config().path,
    pageSize: config().pageSize,
    sortBy: sortKeyMap[sorting()],
    page,
    signal: controller.signal,
    token: userInfo()?.token,
  })
    .then((res) => {
      setStatus('success');
      setCount(res.count);
      setData(data => data.concat(...makeDatasReactive(res.data)));
      setPage(page);
      setTotalPages(res.totalPages);
    })
    .catch((err: Error) => {
      if (err.name !== 'AbortError') {
        console.error(err.message);
        setStatus('error');
      }
    });
  abort = controller.abort.bind(controller);
}

export function loadMore() {
  const { page } = commentListState;
  getCommentData(page() + 1);
}

export function refresh() {
  const { setCount, setData } = commentListState;
  setCount(0);
  setData([]);
  getCommentData(1);
}

export function deleteComment(id: string) {
  const { setData } = commentListState;
  setData(data =>
    data.filter((item) => {
      item.setChildren(children => children.filter(child => child.objectId !== id));
      return item.objectId !== id;
    }),
  );
}

export default commentListState;
