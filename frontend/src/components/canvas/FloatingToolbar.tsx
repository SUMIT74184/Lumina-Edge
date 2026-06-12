"use client";

import { Editor } from '@tiptap/react';

interface FloatingToolbarProps {
  editor: Editor;
}

export default function FloatingToolbar({ editor }: FloatingToolbarProps) {
  return (
    <div className="floating-toolbar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
        title="Bold (Ctrl+B)"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>format_bold</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
        title="Italic (Ctrl+I)"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>format_italic</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'is-active' : ''}
        title="Underline (Ctrl+U)"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>format_underlined</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
        title="Strikethrough"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>strikethrough_s</span>
      </button>

      <div className="divider" />

      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}
        title="Inline Code"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>code</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={editor.isActive('highlight') ? 'is-active' : ''}
        title="Highlight"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>ink_highlighter</span>
      </button>
    </div>
  );
}
