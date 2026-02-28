import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';

interface TiptapEditorProps {
    initialMarkdown: string;
    onChange: (markdown: string) => void;
}

const TiptapEditor = ({ initialMarkdown, onChange }: TiptapEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Markdown,
            Placeholder.configure({
                placeholder: 'Write your notes here... Type / or markdown syntax like # or **',
                emptyEditorClass: 'is-editor-empty',
            })
        ],
        content: initialMarkdown,
        onUpdate: ({ editor }) => {
            // Get markdown output
            const markdown = (editor.storage as any).markdown.getMarkdown();
            onChange(markdown);
        },
        editorProps: {
            attributes: {
                class: 'prose-editor focus:outline-none w-full min-h-[400px]',
            },
        },
    });

    return (
        <>
            <style>{`
        .prose-editor {
          color: #e8eaf0;
          font-family: inherit;
          line-height: 1.7;
          font-size: 1.05rem;
        }
        .prose-editor p {
          margin-bottom: 1em;
        }
        .prose-editor h1 {
          font-size: 2.25em;
          font-weight: 800;
          margin-top: 1.2em;
          margin-bottom: 0.6em;
          line-height: 1.2;
          color: #ffffff;
        }
        .prose-editor h2 {
          font-size: 1.8em;
          font-weight: 700;
          margin-top: 1em;
          margin-bottom: 0.5em;
          line-height: 1.3;
          color: #f8fafc;
        }
        .prose-editor h3 {
          font-size: 1.4em;
          font-weight: 600;
          margin-top: 0.8em;
          margin-bottom: 0.4em;
          color: #f1f5f9;
        }
        .prose-editor ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin-bottom: 1em;
        }
        .prose-editor ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin-bottom: 1em;
        }
        .prose-editor blockquote {
          border-left: 4px solid #4b5563;
          padding-left: 1em;
          font-style: italic;
          color: #9ca3af;
          margin-bottom: 1em;
          background: rgba(255,255,255,0.03);
          padding-top: 0.25em;
          padding-bottom: 0.25em;
          border-radius: 0 4px 4px 0;
        }
        .prose-editor code {
          background-color: #374151;
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.9em;
          color: #e2e8f0;
        }
        .prose-editor pre {
          background-color: #1e293b;
          padding: 1em;
          border-radius: 8px;
          overflow-x: auto;
          margin-bottom: 1em;
          border: 1px solid #334155;
        }
        .prose-editor pre code {
          background-color: transparent;
          padding: 0;
          color: #e2e8f0;
        }
        .prose-editor a {
          color: #60a5fa;
          text-decoration: underline;
        }
        .prose-editor hr {
          border-color: #334155;
          margin-top: 2em;
          margin-bottom: 2em;
        }
        .is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #6b7280;
          pointer-events: none;
          height: 0;
        }
      `}</style>
            <EditorContent editor={editor} style={{ height: "100%" }} />
        </>
    );
};

export default TiptapEditor;
