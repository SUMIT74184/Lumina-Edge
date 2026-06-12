"use client";

import { useState } from 'react';

interface CanvasPage {
  id: string;
  title: string;
  icon: string;
  isPinned: boolean;
  updatedAt: string;
}

interface CanvasPageListProps {
  pages: CanvasPage[];
  selectedPageId: string | null;
  onSelectPage: (id: string) => void;
  onCreatePage: () => void;
  onDeletePage: (id: string) => void;
  onPinPage: (id: string, isPinned: boolean) => void;
  canCreate: boolean;
  isCreating: boolean;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function CanvasPageList({
  pages,
  selectedPageId,
  onSelectPage,
  onCreatePage,
  onDeletePage,
  onPinPage,
  canCreate,
  isCreating,
}: CanvasPageListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
        <h3 className="font-label-caps text-label-caps text-outline uppercase tracking-wider text-xs">Pages</h3>
        <button
          onClick={onCreatePage}
          disabled={!canCreate || isCreating}
          className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${
            canCreate
              ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105'
              : 'bg-surface-container-high text-outline cursor-not-allowed opacity-50'
          }`}
          title={canCreate ? 'New page' : 'Page limit reached — upgrade to create more'}
        >
          <span className="material-symbols-outlined text-lg">{isCreating ? 'hourglass_empty' : 'add'}</span>
        </button>
      </div>

      {/* Page List */}
      <div className="flex-1 overflow-y-auto canvas-page-list px-2 py-2 space-y-1">
        {pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-outline/40 mb-3">edit_note</span>
            <p className="text-sm text-outline">No pages yet</p>
            <p className="text-xs text-outline/60 mt-1">Click + to create your first canvas</p>
          </div>
        ) : (
          pages.map((page) => (
            <div
              key={page.id}
              onMouseEnter={() => setHoveredId(page.id)}
              onMouseLeave={() => { setHoveredId(null); setConfirmDeleteId(null); }}
              onClick={() => onSelectPage(page.id)}
              className={`canvas-page-item flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer group ${
                selectedPageId === page.id
                  ? 'bg-surface-container-high border border-primary/30'
                  : 'hover:bg-surface-container-high border border-transparent'
              }`}
            >
              <span className="text-lg shrink-0">{page.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  selectedPageId === page.id ? 'text-primary' : 'text-on-surface'
                }`}>
                  {page.title}
                </p>
                <p className="text-[10px] text-outline mt-0.5">
                  {page.isPinned && <span className="text-primary mr-1">📌</span>}
                  {timeAgo(page.updatedAt)}
                </p>
              </div>

              {/* Actions */}
              {hoveredId === page.id && (
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onPinPage(page.id, !page.isPinned)}
                    className={`w-6 h-6 flex items-center justify-center rounded text-xs transition-all hover:bg-surface-container-highest ${
                      page.isPinned ? 'text-primary' : 'text-outline hover:text-on-surface'
                    }`}
                    title={page.isPinned ? 'Unpin' : 'Pin to top'}
                  >
                    <span className="material-symbols-outlined text-sm">push_pin</span>
                  </button>
                  {confirmDeleteId === page.id ? (
                    <button
                      onClick={() => { onDeletePage(page.id); setConfirmDeleteId(null); }}
                      className="w-6 h-6 flex items-center justify-center rounded text-xs bg-error/20 text-error transition-all hover:bg-error/30"
                      title="Confirm delete"
                    >
                      <span className="material-symbols-outlined text-sm">check</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(page.id)}
                      className="w-6 h-6 flex items-center justify-center rounded text-xs text-outline hover:text-error hover:bg-surface-container-highest transition-all"
                      title="Delete page"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
