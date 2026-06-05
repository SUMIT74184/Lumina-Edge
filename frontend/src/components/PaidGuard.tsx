"use client";

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaidGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        setIsAuthorized(false);
        return;
      }

      // Admin always gets full access
      const isAdmin = user?.primaryEmailAddress?.emailAddress === 'jaiprakashray747@gmail.com';
      
      // Check if user has premium plan in metadata OR is admin
      const hasPremium = isAdmin ||
                         user?.publicMetadata?.plan === 'elite' || 
                         user?.publicMetadata?.plan === 'max' ||
                         user?.publicMetadata?.role === 'admin' ||
                         process.env.NODE_ENV === 'development' ||
                         process.env.NEXT_PUBLIC_ALLOW_MOCK_PAID === 'true';

      setIsAuthorized(!!hasPremium);
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || isAuthorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background relative flex items-center justify-center p-4 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-tertiary/10 rounded-full blur-[150px]"></div>
        
        {/* Glassmorphic Card */}
        <div className="relative z-10 max-w-lg w-full bg-surface-container/60 backdrop-blur-xl border border-outline-variant/50 p-12 rounded-3xl shadow-2xl flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-surface-container-high rounded-2xl flex items-center justify-center mb-8 shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-tertiary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="material-symbols-outlined text-5xl text-primary drop-shadow-md">lock</span>
          </div>
          
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold mb-4">Elite Access Required</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
            Historical analytics, advanced tracking, and data exports are exclusively available to our Elite and Max tier members. 
            Unlock the full potential of your performance data.
          </p>
          
          <div className="flex flex-col w-full gap-4">
            <Link 
              href="/pricing" 
              className="w-full py-4 bg-primary text-on-primary font-label-caps text-label-caps font-bold tracking-widest rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg hover:shadow-primary/25"
            >
              VIEW PREMIUM PLANS
            </Link>
            <button 
              onClick={() => router.back()} 
              className="w-full py-4 bg-transparent border border-outline-variant text-on-surface font-label-caps text-label-caps tracking-widest rounded-xl hover:bg-surface-container-high transition-all"
            >
              GO BACK
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
