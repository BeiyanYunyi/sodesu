import type { ReactiveComment } from './commentListState';
import { makePersisted } from '@solid-primitives/storage';
import { updateComment } from '@waline/api';
import { createRoot, createSignal } from 'solid-js';
import configProvider from './configProvider';
import userInfoState from './userInfoState';

export type LikeID = number | string;
const likeState = createRoot(() => {
  const [likes, setLikes] = makePersisted(createSignal<LikeID[]>([]), {
    storage: localStorage,
    name: 'WALINE_LIKE',
    deserialize: (data) => {
      try {
        return JSON.parse(data);
      } catch (e) {
        return [];
      }
    },
    serialize: (data) => JSON.stringify(data),
  });
  return { likes, setLikes };
});

export async function handleLike(comment: ReactiveComment): Promise<void> {
  const { config } = configProvider;
  const { objectId } = comment;
  const { likes, setLikes } = likeState;
  const hasLiked = !!likes()?.includes(objectId);
  await updateComment({
    serverURL: config().serverURL,
    lang: config().lang,
    objectId,
    token: userInfoState.userInfo()?.token!,
    comment: { like: !hasLiked },
  });
  if (hasLiked) {
    setLikes((ls) => ls!.filter((id) => id !== objectId));
  } else {
    setLikes((ls) => {
      if (!ls) return [objectId];
      if (ls.length > 50) {
        ls.shift();
      }
      return ls.concat(objectId);
    });
  }
  comment.setLike((like) => (like || 0) + (hasLiked ? -1 : 1));
}

export default likeState;
