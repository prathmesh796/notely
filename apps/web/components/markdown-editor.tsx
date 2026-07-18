"use client"

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
  type MDXEditorMethods,
} from '@mdxeditor/editor'
import type { RefObject } from 'react'
import '@mdxeditor/editor/style.css'

type MarkdownEditorProps = {
  markdown: string
  onChange: (markdown: string) => void
  editorRef?: RefObject<MDXEditorMethods | null>
}

export default function MarkdownEditor({ markdown, onChange, editorRef }: MarkdownEditorProps) {
  return (
    <MDXEditor
      ref={editorRef}
      className="min-h-[calc(100vh-10rem)] rounded-md border border-border bg-background"
      contentEditableClassName="prose min-h-[calc(100vh-14rem)] max-w-none p-6 focus:outline-none dark:prose-invert"
      markdown={markdown}
      onChange={onChange}
      placeholder="Write your note..."
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <CreateLink />
            </>
          ),
        }),
      ]}
    />
  )
}
