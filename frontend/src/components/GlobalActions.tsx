"use client";

import { useRouter } from 'next/navigation';

export default function GlobalActions() {
  const router = useRouter();

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => router.back()} 
        className="material-symbols-outlined p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all"
        title="Go Back"
      >
        arrow_back
      </button>
      <button 
        onClick={() => window.location.reload()} 
        className="material-symbols-outlined p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all"
        title="Reload Page"
      >
        refresh
      </button>
    </div>
  );
}
