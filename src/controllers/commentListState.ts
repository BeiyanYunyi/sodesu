import type { WalineComment, WalineCommentSorting } from '@waline/client';
import { getComment } from '@waline/client/dist/api';
import { createRoot, createSignal } from 'solid-js';
import configProvider from './configProvider';

type SortKey = 'insertedAt_desc' | 'insertedAt_asc' | 'like_desc';

const sortKeyMap: Record<WalineCommentSorting, SortKey> = {
  latest: 'insertedAt_desc',
  oldest: 'insertedAt_asc',
  hottest: 'like_desc',
};

const commentListState = createRoot(() => {
  const { config } = configProvider;
  const [status, setStatus] = createSignal<'loading' | 'success' | 'error'>('loading');
  const [sorting, setSorting] = createSignal(config().commentSorting);
  const [page, setPage] = createSignal(1);
  const [count, setCount] = createSignal(1);
  const [data, setData] = createSignal<WalineComment[]>([]);
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

export const getCommentData = (page: number) => {
  const { sorting, setStatus, setCount, setData, setPage, setTotalPages } = commentListState;
  const { config } = configProvider;
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
    token: undefined,
  })
    .then((res) => {
      setStatus('success');
      setCount(res.count);
      setData((data) => data.concat(...res.data));
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
};

export const refresh = () => {
  const { setCount, setData } = commentListState;
  setCount(0);
  setData([]);
  getCommentData(1);
};

export default commentListState;
