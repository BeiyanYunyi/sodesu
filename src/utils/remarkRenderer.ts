/* eslint-disable import/no-extraneous-dependencies */
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeDocument from 'rehype-document';
import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeDocument)
  .use(rehypeFormat)
  .use(rehypeStringify);

const remarkRenderer = async (text: string) => {
  const txt = await processor.process(text);
  return txt.toString();
};

export default remarkRenderer;
