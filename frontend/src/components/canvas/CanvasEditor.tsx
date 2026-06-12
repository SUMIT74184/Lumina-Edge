"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@/hooks/useApi';
import SlashMenu from './SlashMenu';
import FloatingToolbar from './FloatingToolbar';

interface CanvasEditorProps {
  pageId: string;
  initialContent: string;
  title: string;
  icon: string;
  onTitleChange: (title: string) => void;
  onIconChange: (icon: string) => void;
}

const EMOJI_OPTIONS = [
  '📝', '📓', '📔', '📒', '📕', '📗', '📘', '📙', '🎯', '💡', '🔥', '⭐', '🌙', '🌊', '🎨', '🧠', '💎', '🚀', '📌', '🗓️', '✨', '🎵', '🌿', '🏔️',
  '💻', '📱', '⌨️', '🎧', '📸', '📽️', '🎬', '🎮', '🧩', '🧸', '🍔', '🍕', '🌮', '🍣', '🍩', '☕', '🍺', '🍷', '🥂', '⚽', '🏀', '🏈', '⚾', '🎾',
  '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🛵', '🏍️', '🛺', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟'
];

export default function CanvasEditor({ pageId, initialContent, title, icon, onTitleChange, onIconChange }: CanvasEditorProps) {
  const { mutate: updatePage } = useMutation('/canvas/pages', 'PUT');
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [localTitle, setLocalTitle] = useState(title);
  const [localIcon, setLocalIcon] = useState(icon);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 });
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });

  let parsedContent: any = {};
  try {
    parsedContent = initialContent && initialContent !== '{}' ? JSON.parse(initialContent) : undefined;
  } catch {
    parsedContent = undefined;
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { HTMLAttributes: { class: 'code-block' } },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder: 'Type / for commands, or just start writing...' }),
      Highlight,
      Typography,
      Underline,
      Image,
      Youtube,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: parsedContent,
    editorProps: {
      attributes: {
        class: 'tiptap',
      },
      handleKeyDown: (view, event) => {
        if (event.key === '/' && !showSlashMenu) {
          const { from } = view.state.selection;
          const coords = view.coordsAtPos(from);
          setSlashMenuPos({ top: coords.bottom + 8, left: coords.left });
          setTimeout(() => setShowSlashMenu(true), 10);
        }
        if (event.key === 'Escape' && showSlashMenu) {
          setShowSlashMenu(false);
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      setShowSlashMenu(false);
      debouncedSave(editor.getJSON());
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        // Text is selected — show floating toolbar
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setToolbarPos({
            top: rect.top - 50,
            left: rect.left + (rect.width / 2) - 120,
          });
          setShowToolbar(true);
        }
      } else {
        setShowToolbar(false);
      }
    },
  });

  const debouncedSave = useCallback((content: any) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSaveStatus('idle');
    saveTimerRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await updatePage(
          { content: JSON.stringify(content) },
          `/canvas/pages/${pageId}`
        );
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch {
        setSaveStatus('idle');
      }
    }, 1500);
  }, [pageId, updatePage]);

  const handleTitleBlur = useCallback(async () => {
    if (localTitle !== title) {
      onTitleChange(localTitle);
      try {
        await updatePage({ title: localTitle }, `/canvas/pages/${pageId}`);
      } catch { /* ignore */ }
    }
  }, [localTitle, title, pageId, updatePage, onTitleChange]);

  const handleIconSelect = useCallback(async (emoji: string) => {
    setLocalIcon(emoji);
    setShowEmojiPicker(false);
    onIconChange(emoji);
    try {
      await updatePage({ icon: emoji }, `/canvas/pages/${pageId}`);
    } catch { /* ignore */ }
  }, [pageId, updatePage, onIconChange]);

  const handleSlashCommand = useCallback((command: string) => {
    if (!editor) return;
    setShowSlashMenu(false);

    // Delete the '/' character
    const { from } = editor.state.selection;
    editor.chain().focus().deleteRange({ from: from - 1, to: from }).run();

    switch (command) {
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'h3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'bullet':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'numbered':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'checklist':
        editor.chain().focus().toggleTaskList().run();
        break;
      case 'code':
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case 'quote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'divider':
        editor.chain().focus().setHorizontalRule().run();
        break;
      case 'image': {
        const url = window.prompt('Enter image URL:');
        if (url) editor.chain().focus().setImage({ src: url }).run();
        break;
      }
      case 'video': {
        const url = window.prompt('Enter YouTube URL:');
        if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
        break;
      }
      case 'table':
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        break;
    }
  }, [editor]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  if (!editor) return null;

  return (
    <div className="editor-container flex flex-col h-full">
      {/* Header: Icon + Title + Save Status */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-outline-variant">
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-4xl hover:scale-110 transition-transform cursor-pointer"
            title="Change icon"
          >
            {localIcon}
          </button>
          {showEmojiPicker && (
            <div className="absolute top-14 left-0 z-50 bg-surface-container-high border border-outline-variant rounded-xl p-3 shadow-2xl grid grid-cols-6 gap-2 min-w-[240px] max-h-64 overflow-y-auto">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleIconSelect(emoji)}
                  className="text-2xl hover:scale-125 transition-transform p-1 rounded-lg hover:bg-surface-container-highest"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          type="text"
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          onBlur={handleTitleBlur}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLInputElement).blur(); editor?.commands.focus(); } }}
          placeholder="Untitled"
          className="flex-1 bg-transparent text-3xl font-bold text-on-surface font-headline-xl outline-none border-none placeholder:text-outline caret-primary"
        />

        <div className="flex items-center gap-2 text-xs font-label-caps text-outline shrink-0">
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1 text-primary animate-pulse">
              <span className="material-symbols-outlined text-sm">sync</span>
              SAVING
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1 text-primary/70">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              SAVED
            </span>
          )}
        </div>
      </div>

      {/* Floating Toolbar (manual positioning) */}
      {showToolbar && editor && (
        <div
          className="fixed z-50"
          style={{ top: toolbarPos.top, left: toolbarPos.left }}
        >
          <FloatingToolbar editor={editor} />
        </div>
      )}

      {/* Slash Menu */}
      {showSlashMenu && (
        <div
          className="fixed z-50"
          style={{ top: slashMenuPos.top, left: slashMenuPos.left }}
        >
          <SlashMenu onSelect={handleSlashCommand} onClose={() => setShowSlashMenu(false)} />
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-y-auto pr-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
