'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TrialGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [isTrialExpired, setIsTrialExpired] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const createdAt = user.createdAt;
      if (createdAt) {
        const twelveDaysInMs = 12 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        const timeElapsed = now - createdAt.getTime();
        
        if (timeElapsed > twelveDaysInMs) {
          setIsTrialExpired(true);
        }
      }
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isTrialExpired) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
        <span className="material-symbols-outlined text-6xl text-error mb-4">lock</span>
        <h1 className="text-display-sm font-bold text-on-background mb-4">Free Trial Expired</h1>
        <p className="text-on-surface-variant max-w-md mb-8">
          Your 12-day free trial of Lumina Edge has ended. To continue accessing your finance, schedule, and health tracking, please upgrade to a premium plan.
        </p>
        <Link 
          href="/pricing"
          className="px-6 py-3 bg-primary text-on-primary rounded-full font-bold hover:bg-primary/90 transition-colors"
        >
          View Plans & Upgrade
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
