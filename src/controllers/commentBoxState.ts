import { addComment, updateComment, type WalineCommentData } from '@waline/api';
import { createEffect, createMemo, createResource, createRoot, createSignal } from 'solid-js';
import { getWordNumber } from '../waline/utils/wordCount';
import commentListState, { makeDataReactive, type ReactiveComment } from './commentListState';
import configProvider from './configProvider';
import userInfoState from './userInfoState';

const commentBoxState = createRoot(() => {
  const [edit, setEdit] = createSignal<ReactiveComment | null>(null);
  const [rootId, setRootId] = createSignal<string | undefined>();
  const [replyId, setReplyId] = createSignal<string | undefined>();
  const [replyUser, setReplyUser] = createSignal<string | undefined>();
  const [content, setContent] = createSignal('');
  const [wordCount, setWordCount] = createSignal(0);
  const [isWordCountLegal, setIsWordCountLegal] = createSignal(false);
  const [wordLimit, setWordLimit] = createSignal(0);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [showPreview, setShowPreview] = createSignal(false);
  const { config } = configProvider;
  const previewSignal = createMemo(() => ({ showPreview: showPreview(), content: content() }));
  const [previewText, { mutate: setPreviewText }] = createResource(
    previewSignal,
    async (preSign: { content: string; showPreview: boolean }) => {
      if (!preSign.showPreview) return '';
      return config().renderPreview(preSign.content);
    },
  );
  const limit = createMemo(() => config().wordLimit);
  let editorRef: HTMLTextAreaElement | undefined;
  createEffect(() => {
    setWordCount(getWordNumber(content()));
  });
  createEffect(() => {
    if (limit()) {
      const limit2 = limit() as [number, number];
      if (wordCount() < limit2[0] && limit2[0] !== 0) {
        setWordLimit(limit2[0]);
        setIsWordCountLegal(false);
      } else if (wordCount() > limit2[1]) {
        setWordLimit(limit2[1]);
        setIsWordCountLegal(false);
      } else {
        setWordLimit(limit2[1]);
        setIsWordCountLegal(true);
      }
    } else {
      setWordLimit(0);
      setIsWordCountLegal(true);
    }
  });
  createEffect(() => {
    if (edit()) {
      setContent(edit()!.orig() || '');
    }
  });
  return {
    edit,
    rootId,
    replyId,
    replyUser,
    content,
    wordCount,
    isWordCountLegal,
    wordLimit,
    isSubmitting,
    previewText,
    editorRef,
    showPreview,
    setEdit,
    setReplyId,
    setReplyUser,
    setRootId,
    setContent,
    setWordCount,
    setIsSubmitting,
    setPreviewText,
    setShowPreview,
  };
});

export const userMetaState = createRoot(() => {
  const [userMeta, setUserMeta] = createSignal({ nick: '', mail: '', link: '' });
  const inputRefs: Record<'nick' | 'mail' | 'link', HTMLInputElement | undefined> = {
    nick: undefined,
    mail: undefined,
    link: undefined,
  };
  return { userMeta, setUserMeta, inputRefs };
});

export function clearReplyState() {
  const { setReplyId, setReplyUser, setRootId } = commentBoxState;
  setReplyId(undefined);
  setReplyUser(undefined);
  setRootId(undefined);
}

export function submitComment() {
  const { config, locale } = configProvider;
  const {
    edit,
    content,
    wordCount,
    isWordCountLegal,
    rootId,
    replyId,
    replyUser,
    editorRef,
    setIsSubmitting,
    setEdit,
    setContent,
    setPreviewText,
  } = commentBoxState;
  const { userMeta, inputRefs } = userMetaState;
  const { userInfo } = userInfoState;
  const { serverURL, lang, login, wordLimit, requiredMeta } = config();
  const { data, setData } = commentListState;
  // let token = '' //preserved for Recaptcha
  const comment: WalineCommentData = {
    comment: content(),
    nick: userMeta().nick,
    mail: userMeta().mail,
    link: userMeta().link,
    ua: navigator.userAgent,
    url: config().path,
    recaptchaV3: '',
  };
  if (userInfo()?.token) {
    // login user
    comment.nick = userInfo()!.display_name;
    comment.mail = userInfo()!.email;
    comment.link = userInfo()!.url;
  } else {
    if (login === 'force') return null;

    // check nick
    if (requiredMeta.includes('nick') && !comment.nick) {
      inputRefs.nick?.focus();

      return alert(locale().nickError);
    }

    // check mail
    if (
      (requiredMeta.includes('mail') && !comment.mail) ||
      (comment.mail && !/^\w(?:[\w.\-]*\w)?@(?:\w(?:[\w-]*\w)?\.)*\w+$/.exec(comment.mail))
    ) {
      inputRefs.mail?.focus();

      return alert(locale().mailError);
    }

    // check comment
    if (!comment.comment) {
      editorRef?.focus();

      return null;
    }

    if (!comment.nick) comment.nick = locale().anonymous;
  }
  if (!isWordCountLegal()) {
    return alert(
      locale()
        .wordHint.replace('$0', (wordLimit as [number, number])[0].toString())
        .replace('$1', (wordLimit as [number, number])[1].toString())
        .replace('$2', wordCount().toString()),
    );
  }

  if (replyId() && rootId()) {
    comment.pid = replyId();
    comment.rid = rootId();
    comment.at = replyUser();
  }
  setIsSubmitting(true);
  const options = { serverURL, lang, token: userInfo()?.token || '', comment };
  return (edit() ? updateComment({ objectId: edit()!.objectId, ...options }) : addComment(options))
    .then((res) => {
      setIsSubmitting(false);
      if (res.errmsg) return alert(res.errmsg);
      const resComment = res.data!;
      if (edit()) {
        const target = data().find((item) => item.objectId === edit()!.objectId);
        if (!target) return null;
        target.setComment(resComment.comment);
        if (resComment.orig) target.setOrig(resComment.orig);
        setEdit(null);
        clearReplyState();
      } else if ('rid' in resComment) {
        const target = data().find((item) => item.objectId === resComment.rid);
        if (!target) return null;
        target.setChildren((prev) => [...prev, makeDataReactive(resComment)]);
        clearReplyState();
      } else {
        setData((dat) => [makeDataReactive(resComment), ...dat]);
      }
      setContent('');
      setPreviewText('');
      if (replyId()) {
        clearReplyState();
      }
      return null;
    })
    .catch((err: TypeError) => {
      setIsSubmitting(false);
      alert(err.message);
    });
}

export default commentBoxState;
