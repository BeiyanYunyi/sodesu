import { WalineComment, WalineCommentData } from '@waline/client';
import { createEffect, createMemo, createRoot, createSignal } from 'solid-js';
import { addComment, updateComment } from '@waline/client/dist/api';
import { getWordNumber } from '../waline/utils/wordCount';
import configProvider from './configProvider';

const commentBoxState = createRoot(() => {
  const [edit, setEdit] = createSignal<WalineComment | null>(null);
  const [rootId, setRootId] = createSignal<string | undefined>();
  const [replyId, setReplyId] = createSignal<string | undefined>();
  const [replyUser, setReplyUser] = createSignal<string | undefined>();
  const [content, setContent] = createSignal('');
  const [wordCount, setWordCount] = createSignal(0);
  const [isWordCountLegal, setIsWordCountLegal] = createSignal(false);
  const [wordLimit, setWordLimit] = createSignal(0);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [previewText, setPreviewText] = createSignal('');
  const { config } = configProvider;
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
    setEdit,
    setReplyId,
    setReplyUser,
    setRootId,
    setContent,
    setWordCount,
    setIsSubmitting,
    setPreviewText,
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

export const submitComment = () => {
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
    setContent,
    setPreviewText,
  } = commentBoxState;
  const { userMeta, inputRefs } = userMetaState;
  const { serverURL, lang, login, wordLimit, requiredMeta } = config();
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
  if (false /* userInfo.value?.token */) {
    // login user
    // comment.nick = userInfo.value.display_name;
    // comment.mail = userInfo.value.email;
    // comment.link = userInfo.value.url;
  } else {
    if (login === 'force') return null;

    // check nick
    if (requiredMeta.indexOf('nick') > -1 && !comment.nick) {
      inputRefs.nick?.focus();

      return alert(locale().nickError);
    }

    // check mail
    if (
      (requiredMeta.indexOf('mail') > -1 && !comment.mail) ||
      (comment.mail && !/^\w(?:[\w._-]*\w)?@(?:\w(?:[\w-]*\w)?\.)*\w+$/.exec(comment.mail))
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
  if (!isWordCountLegal())
    return alert(
      locale()
        .wordHint.replace('$0', (wordLimit as [number, number])[0].toString())
        .replace('$1', (wordLimit as [number, number])[1].toString())
        .replace('$2', wordCount().toString()),
    );

  if (replyId() && rootId()) {
    comment.pid = replyId();
    comment.rid = rootId();
    comment.at = replyUser();
  }
  setIsSubmitting(true);
  const options = { serverURL, lang, token: '', comment };
  return (edit() ? updateComment({ objectId: edit()!.objectId, ...options }) : addComment(options))
    .then((res) => {
      setIsSubmitting(false);
      if (res.errmsg) return alert(res.errmsg);
      setContent('');
      setPreviewText('');
      return null;
    })
    .catch((err: TypeError) => {
      setIsSubmitting(false);
      alert(err.message);
    });
};

export default commentBoxState;
