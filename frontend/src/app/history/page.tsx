"use client";

import { useState, useEffect, Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
import PaidGuard from '@/components/PaidGuard';
import { useFetch } from '@/hooks/useApi';
import { useSearchParams } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';

function HistoryContent() {
  const { isCollapsed } = useSidebar();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'finance';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (searchParams.get('tab')) {
      setActiveTab(searchParams.get('tab')!);
    }
  }, [searchParams]);

  return (
    <PaidGuard>
      <div className="min-h-screen bg-background text-on-background flex">
        <Sidebar />
        
        <main className={`flex-1 ml-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} transition-all duration-300 p-8 md:p-margin-desktop overflow-hidden flex flex-col h-screen`}>
          <div className="mb-8 shrink-0">
            <h1 className="font-headline-xl text-primary mb-2">Analytics & History</h1>
            <p className="text-on-surface-variant font-body-lg">View, edit, and analyze your comprehensive historical data.</p>
          </div>

          <div className="flex gap-4 border-b border-outline-variant mb-6 shrink-0">
            <button 
              onClick={() => setActiveTab('finance')}
              className={`pb-4 px-4 font-label-caps font-bold transition-all relative ${activeTab === 'finance' ? 'text-primary' : 'text-outline hover:text-on-surface'}`}
            >
              FINANCE
              {activeTab === 'finance' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('health')}
              className={`pb-4 px-4 font-label-caps font-bold transition-all relative ${activeTab === 'health' ? 'text-primary' : 'text-outline hover:text-on-surface'}`}
            >
              HEALTH & VITALITY
              {activeTab === 'health' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('time')}
              className={`pb-4 px-4 font-label-caps font-bold transition-all relative ${activeTab === 'time' ? 'text-primary' : 'text-outline hover:text-on-surface'}`}
            >
              TIME & SCHEDULE
              {activeTab === 'time' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 pb-20">
            {activeTab === 'finance' && <FinanceHistory />}
            {activeTab === 'health' && <HealthHistory />}
            {activeTab === 'time' && <TimeHistory />}
          </div>
        </main>
      </div>
    </PaidGuard>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <HistoryContent />
    </Suspense>
  );
}

// ---------------------------------------------
// FINANCE HISTORY
// ---------------------------------------------
function FinanceHistory() {
  const { data: transactionsData, loading } = useFetch<any>('/finance/transactions?page=0&size=100');

  if (loading) return <div className="animate-pulse h-32 bg-surface-container rounded-xl border border-outline-variant"></div>;

  const transactions = transactionsData?.content || [];

  return (
    <div className="space-y-4">
      {transactions?.map((t: any) => (
        <div key={t.id} className="bg-surface-container p-4 rounded-xl border border-outline-variant flex justify-between items-center">
          <div>
            <div className="font-bold text-on-surface">{t.category}</div>
            <div className="text-sm text-on-surface-variant">{new Date(t.date).toLocaleDateString()}</div>
          </div>
          <div className={`font-bold font-data-display ${t.type === 'INCOME' ? 'text-primary' : 'text-error'}`}>
            {t.type === 'INCOME' ? '+' : '-'}₹{t.amount.toLocaleString()}
          </div>
        </div>
      ))}
      {!transactions.length && <p className="text-outline">No financial history found.</p>}
    </div>
  );
}

// ---------------------------------------------
// HEALTH HISTORY
// ---------------------------------------------
function HealthHistory() {
  const { data: workouts, loading: wLoading } = useFetch<any[]>('/health/workouts');
  const { data: nutrition, loading: nLoading } = useFetch<any[]>('/health/nutrition');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="font-headline-sm text-primary mb-4">Workout History</h3>
        {wLoading ? <div className="animate-pulse h-32 bg-surface-container rounded-xl"></div> : (
          <div className="space-y-4">
            {workouts?.map((w: any) => (
              <div key={w.id} className="bg-surface-container p-4 rounded-xl border border-outline-variant">
                <div className="font-bold text-on-surface">{w.name}</div>
                <div className="text-sm text-on-surface-variant">{new Date(w.workoutDate).toLocaleDateString()} - {w.durationMinutes} mins</div>
              </div>
            ))}
            {!workouts?.length && <p className="text-outline">No workout history found.</p>}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-headline-sm text-primary mb-4">Nutrition History</h3>
        {nLoading ? <div className="animate-pulse h-32 bg-surface-container rounded-xl"></div> : (
          <div className="space-y-4">
            {nutrition?.map((n: any) => (
              <div key={n.id} className="bg-surface-container p-4 rounded-xl border border-outline-variant">
                <div className="font-bold text-on-surface">{n.mealName}</div>
                <div className="text-sm text-on-surface-variant">{new Date(n.logDate).toLocaleDateString()} - {n.calories} kcal</div>
              </div>
            ))}
            {!nutrition?.length && <p className="text-outline">No nutrition history found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------
// TIME HISTORY
// ---------------------------------------------
function TimeHistory() {
  // Fetch a wide range of history
  const { data: events, loading } = useFetch<any[]>('/time/events?startDate=2000-01-01&endDate=2099-12-31');

  if (loading) return <div className="animate-pulse h-32 bg-surface-container rounded-xl"></div>;

  // Group by date or just list them. Listing in reverse chronological order for history.
  const sortedEvents = events ? [...events].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()) : [];

  return (
    <div className="space-y-4">
      {sortedEvents?.map((ev: any) => (
        <div key={ev.id} className="bg-surface-container p-4 rounded-xl border border-outline-variant flex justify-between items-start">
          <div>
            <div className="font-bold text-on-surface text-lg">{ev.title}</div>
            <div className="text-sm text-on-surface-variant mb-2">
              {new Date(ev.startTime).toLocaleString()} - {new Date(ev.endTime).toLocaleString()}
            </div>
            {ev.description && <p className="text-sm text-on-surface-variant line-clamp-2">{ev.description}</p>}
          </div>
          <div className="flex flex-col items-end gap-2">
            {ev.status === 'COMPLETED' && <span className="text-[10px] font-label-caps bg-primary/20 text-primary px-3 py-1 rounded-full whitespace-nowrap">COMPLETED</span>}
            {ev.status === 'MIDWAY' && <span className="text-[10px] font-label-caps bg-tertiary/20 text-tertiary px-3 py-1 rounded-full whitespace-nowrap">MIDWAY</span>}
            {ev.status === 'INCOMPLETE' && <span className="text-[10px] font-label-caps bg-error/20 text-error px-3 py-1 rounded-full whitespace-nowrap">INCOMPLETE</span>}
          </div>
        </div>
      ))}
      {!sortedEvents?.length && <p className="text-outline">No time history found.</p>}
    </div>
  );
}
