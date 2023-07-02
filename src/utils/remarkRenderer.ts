/* eslint-disable import/no-extraneous-dependencies */
import rehypeDocument from 'rehype-document';
import rehypeFormat from 'rehype-format';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const processor = unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeKatex)
  .use(rehypeDocument)
  .use(rehypeFormat)
  .use(rehypeStringify);

const remarkRenderer = async (text: string) => {
  const txt = await processor.process(text);
  return txt.toString();
};

export default remarkRenderer;
