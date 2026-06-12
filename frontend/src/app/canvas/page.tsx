"use client";

import { useState, useCallback, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useFetch, useMutation } from '@/hooks/useApi';
import { useSidebar } from '@/context/SidebarContext';
import Sidebar from '@/components/Sidebar';
import TrialGuard from '@/components/TrialGuard';
import CanvasPageList from '@/components/canvas/CanvasPageList';
import CanvasEditor from '@/components/canvas/CanvasEditor';
import QuotaBanner from '@/components/canvas/QuotaBanner';
import './canvas.css';

interface CanvasPage {
  id: string;
  title: string;
  icon: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface QuotaInfo {
  currentCount: number;
  maxAllowed: number;
  canCreate: boolean;
}

export default function CanvasDashboard() {
  const { isCollapsed } = useSidebar();
  const { user, isLoaded } = useUser();
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<CanvasPage | null>(null);
  const [pageListKey, setPageListKey] = useState(0); // Force re-render of list

  // Determine user plan
  const isAdmin = user?.primaryEmailAddress?.emailAddress === 'jaiprakashray747@gmail.com';
  const isPremium = isAdmin ||
    user?.publicMetadata?.plan === 'elite' ||
    user?.publicMetadata?.plan === 'max' ||
    user?.publicMetadata?.role === 'admin';
  const userPlan = isPremium ? 'premium' : 'free';

  // Fetch pages list
  const { data: pages, loading: pagesLoading, refetch: refetchPages } = useFetch<CanvasPage[]>('/canvas/pages');

  // Fetch quota (we build it client-side from pages data for simplicity)
  const maxAllowed = isPremium ? 40 : 2;
  const currentCount = pages?.length || 0;
  const canCreate = currentCount < maxAllowed;

  // Mutations
  const { mutate: createPage, loading: creating } = useMutation<CanvasPage>('/canvas/pages', 'POST');
  const { mutate: deletePage } = useMutation('/canvas/pages', 'DELETE');
  const { mutate: updatePage } = useMutation('/canvas/pages', 'PUT');

  // Auto-select first page on load
  useEffect(() => {
    if (pages && pages.length > 0 && !selectedPageId) {
      setSelectedPageId(pages[0].id);
      setSelectedPage(pages[0]);
    }
  }, [pages, selectedPageId]);

  // Update selected page when pages change
  useEffect(() => {
    if (selectedPageId && pages) {
      const found = pages.find((p) => p.id === selectedPageId);
      if (found) setSelectedPage(found);
    }
  }, [pages, selectedPageId]);

  const handleCreatePage = useCallback(async () => {
    try {
      const newPage = await createPage(
        { title: 'Untitled', icon: '📝', content: '{}' },
        `/canvas/pages`
      );
      if (newPage) {
        await refetchPages();
        setSelectedPageId(newPage.id);
        setSelectedPage(newPage);
      }
    } catch (err) {
      console.error('Failed to create page:', err);
    }
  }, [createPage, refetchPages]);

  const handleDeletePage = useCallback(async (id: string) => {
    try {
      await deletePage(undefined, `/canvas/pages/${id}`);
      if (selectedPageId === id) {
        setSelectedPageId(null);
        setSelectedPage(null);
      }
      await refetchPages();
    } catch (err) {
      console.error('Failed to delete page:', err);
    }
  }, [deletePage, selectedPageId, refetchPages]);

  const handlePinPage = useCallback(async (id: string, isPinned: boolean) => {
    try {
      await updatePage({ isPinned }, `/canvas/pages/${id}`);
      await refetchPages();
    } catch (err) {
      console.error('Failed to pin page:', err);
    }
  }, [updatePage, refetchPages]);

  const handleSelectPage = useCallback((id: string) => {
    if (pages) {
      const page = pages.find((p) => p.id === id);
      setSelectedPageId(id);
      setSelectedPage(page || null);
    }
  }, [pages]);

  const handleTitleChange = useCallback((title: string) => {
    if (selectedPage) {
      setSelectedPage({ ...selectedPage, title });
    }
    refetchPages();
  }, [selectedPage, refetchPages]);

  const handleIconChange = useCallback((icon: string) => {
    if (selectedPage) {
      setSelectedPage({ ...selectedPage, icon });
    }
    refetchPages();
  }, [selectedPage, refetchPages]);

  return (
    <TrialGuard>
      <div className="min-h-screen bg-background text-on-background">
        <Sidebar />
        <main className={`ml-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} transition-all duration-300 h-screen flex`}>

          {/* Left Panel — Page List */}
          <div className="w-72 shrink-0 border-r border-outline-variant bg-surface-container-low flex flex-col h-screen">
            <CanvasPageList
              pages={pages || []}
              selectedPageId={selectedPageId}
              onSelectPage={handleSelectPage}
              onCreatePage={handleCreatePage}
              onDeletePage={handleDeletePage}
              onPinPage={handlePinPage}
              canCreate={canCreate}
              isCreating={creating}
            />
            <QuotaBanner
              currentCount={currentCount}
              maxAllowed={maxAllowed}
              canCreate={canCreate}
            />
          </div>

          {/* Right Panel — Editor */}
          <div className="flex-1 h-screen overflow-hidden">
            {pagesLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : selectedPage ? (
              <div className="h-full p-8 md:p-12 overflow-y-auto">
                <CanvasEditor
                  key={selectedPage.id}
                  pageId={selectedPage.id}
                  initialContent={selectedPage.content}
                  title={selectedPage.title}
                  icon={selectedPage.icon}
                  onTitleChange={handleTitleChange}
                  onIconChange={handleIconChange}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 bg-surface-container rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  <span className="material-symbols-outlined text-5xl text-outline/30">edit_note</span>
                </div>
                <h2 className="font-headline-lg text-on-surface/60 mb-2">No Page Selected</h2>
                <p className="text-sm text-outline max-w-xs">
                  {pages && pages.length > 0
                    ? 'Select a page from the sidebar to start editing'
                    : 'Create your first canvas page to start your diary'
                  }
                </p>
                {pages && pages.length === 0 && canCreate && (
                  <button
                    onClick={handleCreatePage}
                    disabled={creating}
                    className="mt-6 px-6 py-3 bg-primary text-on-primary font-label-caps text-label-caps font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg hover:shadow-primary/25"
                  >
                    {creating ? 'Creating...' : 'Create First Page'}
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </TrialGuard>
  );
}
