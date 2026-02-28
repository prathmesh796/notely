import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";

export function parseMarkdown(markdown: string) {
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .parse(markdown);

  return tree;
}
