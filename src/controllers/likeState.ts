import { createStorageSignal } from '@solid-primitives/storage';
import { updateComment } from '@waline/client';
import { createRoot } from 'solid-js';
import { type ReactiveComment } from './commentListState';
import configProvider from './configProvider';
import userInfoState from './userInfoState';

export type LikeID = number | string;
const likeState = createRoot(() => {
  const [likes, setLikes] = createStorageSignal<LikeID[]>('WALINE_LIKE', [], {
    deserializer: (data) => {
      try {
        return JSON.parse(data);
      } catch (e) {
        return [];
      }
    },
    serializer: (data) => JSON.stringify(data),
  });
  return { likes, setLikes };
});

export const handleLike = async (comment: ReactiveComment): Promise<void> => {
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
};

export default likeState;
