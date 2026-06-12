"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFetch, useMutation } from '@/hooks/useApi';
import { useSidebar } from '@/context/SidebarContext';
import Sidebar from '@/components/Sidebar';
import TrialGuard from '@/components/TrialGuard';
import CanvasEditor from '@/components/canvas/CanvasEditor';
import '../canvas.css';

interface CanvasPage {
  id: string;
  title: string;
  icon: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CanvasPageDetail() {
  const params = useParams();
  const router = useRouter();
  const { isCollapsed } = useSidebar();
  const pageId = params.id as string;

  const { data: page, loading, error } = useFetch<CanvasPage>(
    pageId ? `/canvas/pages/${pageId}` : null
  );

  if (loading) {
    return (
      <TrialGuard>
        <div className="min-h-screen bg-background text-on-background">
          <Sidebar />
          <main className={`ml-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} transition-all duration-300 flex items-center justify-center h-screen`}>
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </main>
        </div>
      </TrialGuard>
    );
  }

  if (error || !page) {
    return (
      <TrialGuard>
        <div className="min-h-screen bg-background text-on-background">
          <Sidebar />
          <main className={`ml-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} transition-all duration-300 flex flex-col items-center justify-center h-screen`}>
            <span className="material-symbols-outlined text-5xl text-error mb-4">error</span>
            <h2 className="font-headline-lg text-on-surface mb-2">Page Not Found</h2>
            <p className="text-sm text-outline mb-6">This canvas page doesn't exist or you don't have access to it.</p>
            <button
              onClick={() => router.push('/canvas')}
              className="px-6 py-3 bg-primary text-on-primary font-label-caps font-bold rounded-xl hover:brightness-110 transition-all"
            >
              Back to Canvas
            </button>
          </main>
        </div>
      </TrialGuard>
    );
  }

  return (
    <TrialGuard>
      <div className="min-h-screen bg-background text-on-background">
        <Sidebar />
        <main className={`ml-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} transition-all duration-300 h-screen`}>
          {/* Back button */}
          <div className="px-8 pt-6">
            <button
              onClick={() => router.push('/canvas')}
              className="flex items-center gap-2 text-sm text-outline hover:text-on-surface transition-colors font-label-caps"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              ALL PAGES
            </button>
          </div>

          {/* Editor */}
          <div className="p-8 md:p-12 h-[calc(100vh-60px)] overflow-y-auto">
            <CanvasEditor
              key={page.id}
              pageId={page.id}
              initialContent={page.content}
              title={page.title}
              icon={page.icon}
              onTitleChange={() => {}}
              onIconChange={() => {}}
            />
          </div>
        </main>
      </div>
    </TrialGuard>
  );
}
