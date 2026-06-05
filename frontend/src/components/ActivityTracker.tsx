"use client";

import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { fetchApi } from '@/lib/api';

interface ActivityEvent {
  eventType: string;
  page: string;
}

export default function ActivityTracker() {
  const { userId, isLoaded } = useAuth();
  const pathname = usePathname();
  const bufferRef = useRef<ActivityEvent[]>([]);
  const flushTimerRef = useRef<NodeJS.Timeout | null>(null);

  const flush = useCallback(async () => {
    if (!userId || bufferRef.current.length === 0) return;

    const events = [...bufferRef.current];
    bufferRef.current = [];

    try {
      await fetchApi('/activity/batch', {
        method: 'POST',
        headers: { 'X-User-Id': userId },
        body: JSON.stringify(events),
      });
    } catch (err) {
      // If flush fails, push events back into buffer so they aren't lost
      bufferRef.current = [...events, ...bufferRef.current];
    }
  }, [userId]);

  // Track clicks
  useEffect(() => {
    if (!isLoaded || !userId) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName?.toLowerCase() || 'unknown';
      const text = target.textContent?.slice(0, 50) || '';
      
      bufferRef.current.push({
        eventType: 'CLICK',
        page: window.location.pathname,
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isLoaded, userId]);

  // Track navigations
  useEffect(() => {
    if (!isLoaded || !userId) return;

    bufferRef.current.push({
      eventType: 'NAVIGATION',
      page: pathname,
    });
  }, [pathname, isLoaded, userId]);

  // Periodic flush every 30 seconds
  useEffect(() => {
    if (!isLoaded || !userId) return;

    flushTimerRef.current = setInterval(flush, 30000);

    return () => {
      if (flushTimerRef.current) clearInterval(flushTimerRef.current);
    };
  }, [flush, isLoaded, userId]);

  // Flush on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (userId && bufferRef.current.length > 0) {
        const events = bufferRef.current;
        bufferRef.current = [];
        // Use sendBeacon for reliability during unload
        const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/activity/batch`;
        const blob = new Blob([JSON.stringify(events)], { type: 'application/json' });
        // sendBeacon doesn't support custom headers, so fall back to fetch with keepalive
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
          body: JSON.stringify(events),
          keepalive: true,
        }).catch(() => {});
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [userId]);

  // This component renders nothing — it's purely a side-effect tracker
  return null;
}
