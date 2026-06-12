"use client";

import { useEffect, useRef, useState } from 'react';

interface SlashMenuProps {
  onSelect: (command: string) => void;
  onClose: () => void;
}

const COMMANDS = [
  { id: 'h1', label: 'Heading 1', description: 'Large section heading', icon: 'title' },
  { id: 'h2', label: 'Heading 2', description: 'Medium section heading', icon: 'format_h2' },
  { id: 'h3', label: 'Heading 3', description: 'Small section heading', icon: 'format_h3' },
  { id: 'bullet', label: 'Bullet List', description: 'Simple bullet list', icon: 'format_list_bulleted' },
  { id: 'numbered', label: 'Numbered List', description: 'Ordered numbered list', icon: 'format_list_numbered' },
  { id: 'checklist', label: 'Checklist', description: 'Track tasks with checkboxes', icon: 'checklist' },
  { id: 'code', label: 'Code Block', description: 'Monospace code snippet', icon: 'code_blocks' },
  { id: 'quote', label: 'Blockquote', description: 'Capture a quote', icon: 'format_quote' },
  { id: 'divider', label: 'Divider', description: 'Horizontal separator', icon: 'horizontal_rule' },
  { id: 'image', label: 'Image', description: 'Upload or embed an image', icon: 'image' },
  { id: 'video', label: 'Video', description: 'Embed a YouTube video', icon: 'smart_display' },
  { id: 'table', label: 'Table', description: 'Add a simple table', icon: 'table_view' },
];

export default function SlashMenu({ onSelect, onClose }: SlashMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filter, setFilter] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredCommands = COMMANDS.filter((cmd) =>
    cmd.label.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          onSelect(filteredCommands[selectedIndex].id);
        }
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Backspace' && filter.length === 0) {
        onClose();
      } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
        setFilter((prev) => prev + e.key);
        setSelectedIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredCommands, selectedIndex, filter, onSelect, onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div ref={menuRef} className="slash-menu">
      {filter && (
        <div className="px-3 py-1.5 text-xs text-outline font-label-caps border-b border-outline-variant mb-1">
          Filter: {filter}
        </div>
      )}
      {filteredCommands.length === 0 ? (
        <div className="px-3 py-4 text-sm text-outline text-center">No matching commands</div>
      ) : (
        filteredCommands.map((cmd, index) => (
          <button
            key={cmd.id}
            className={`slash-menu-item w-full text-left ${index === selectedIndex ? 'is-selected' : ''}`}
            onClick={() => onSelect(cmd.id)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div className="icon">
              <span className="material-symbols-outlined">{cmd.icon}</span>
            </div>
            <div>
              <div className="label">{cmd.label}</div>
              <div className="description">{cmd.description}</div>
            </div>
          </button>
        ))
      )}
    </div>
  );
}
