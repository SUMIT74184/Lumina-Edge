"use client";

import { useFetch } from '@/hooks/useApi';
import Sidebar from '@/components/Sidebar';
import { useEffect, useState } from 'react';
import TrialGuard from '@/components/TrialGuard';
import { useSidebar } from '@/context/SidebarContext';
import { UserButton } from '@clerk/nextjs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

// Interfaces matching API payloads
interface FinanceSummary {
  totalIncome?: number;
  totalExpense?: number;
  netSavings?: number;
}

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
}

interface NutritionSummary {
  totalCalories?: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFats?: number;
}

export default function HomePage() {
  const { isCollapsed } = useSidebar();
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Fetch real backend data
  const { data: financeData } = useFetch<FinanceSummary>(`/finance/summary?month=${currentMonth}`);
  const { data: yearlyFinanceData } = useFetch<FinanceSummary[]>(`/finance/summary/yearly`);
  const { data: eventsData } = useFetch<CalendarEvent[]>(`/time/events?startDate=${currentDate}&endDate=${currentDate}`);
  const { data: healthData } = useFetch<NutritionSummary>(`/health/nutrition/summary?date=${currentDate}`);

  // Telemetry real-time dynamic state
  const [telemetry, setTelemetry] = useState({
    cpu: 12,
    latency: 4,
    nodes: 104,
    uptime: 99.98
  });

  // Generate 24 hours of mock activity for the heatmap
  const [activityData, setActivityData] = useState<any[]>([]);
  useEffect(() => {
    // Generate beautiful curved data for 24 hours
    const generateData = () => Array.from({ length: 24 }, (_, i) => {
      // Simulate peak hours around 9am, 2pm, and 8pm
      let base = 10;
      if (i >= 8 && i <= 11) base = 50 + Math.random() * 30;
      if (i >= 13 && i <= 16) base = 60 + Math.random() * 40;
      if (i >= 19 && i <= 22) base = 70 + Math.random() * 20;
      return {
        time: `${i.toString().padStart(2, '0')}:00`,
        activity: Math.floor(base + Math.random() * 15)
      };
    });
    
    setActivityData(generateData());

    // Make the graph dynamic by fluctuating values every 3 seconds
    const activityInterval = setInterval(() => {
      setActivityData(prev => prev.map(dataPoint => {
        // Randomly fluctuate activity up or down by a small amount
        const fluctuation = Math.floor(Math.random() * 10) - 5;
        const newActivity = Math.max(0, dataPoint.activity + fluctuation);
        return { ...dataPoint, activity: newActivity };
      }));
    }, 3000);

    return () => clearInterval(activityInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        cpu: Math.max(5, Math.min(85, Math.round(prev.cpu + (Math.random() * 6 - 3)))),
        latency: Math.max(2, Math.min(15, Math.round(prev.latency + (Math.random() * 4 - 2)))),
        nodes: prev.nodes,
        uptime: parseFloat((99.98 + Math.random() * 0.01).toFixed(2))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TrialGuard>
      <div className="min-h-screen bg-background text-on-background">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Top AppBar */}
        <header className={`flex justify-between items-center w-full pl-0 ${isCollapsed ? 'md:pl-28' : 'md:pl-72'} pr-6 md:pr-margin-desktop py-stack-md bg-surface dark:bg-surface-dim sticky top-0 z-40 transition-all duration-300`}>
          <div className="md:hidden font-headline-md text-headline-md font-black italic text-on-surface ml-4">Lumina Edge</div>
          <div className="hidden md:flex items-center gap-stack-lg">
            <nav className="flex gap-2 bg-surface-container-low p-1 rounded-full border border-outline-variant/50 shadow-inner">
              <Link href="/" className="px-4 py-1.5 rounded-full bg-surface-container-high text-primary font-label-caps text-[11px] font-bold shadow-sm transition-all">Overview</Link>
              <Link href="/pricing" className="px-4 py-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all font-label-caps text-[11px] font-bold">Plans</Link>
            </nav>
            <Link href="/checkout" className="px-4 py-1.5 rounded-full bg-primary text-on-primary hover:brightness-110 transition-all font-label-caps text-[11px] font-bold shadow-md shadow-primary/20 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              Upgrade to Elite
            </Link>
          </div>
          <div className="flex items-center gap-stack-md">
            <div className="relative hidden sm:block">
              <input className="bg-surface-container-low border-none rounded-lg py-2 pl-4 pr-10 text-body-sm w-64 focus:ring-1 focus:ring-outline text-on-surface" placeholder="Global Search..." type="text" />
              <span className="material-symbols-outlined absolute right-3 top-2 text-outline">search</span>
            </div>
            <button className="material-symbols-outlined text-on-surface-variant opacity-80 active:opacity-100 transition-all">notifications</button>
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
          </div>
        </header>

        <main className={`ml-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} min-h-screen transition-all duration-300`}>
          {/* Hero Section */}
          <section className="relative h-[500px] flex items-center justify-center overflow-hidden hero-gradient bg-surface-container-lowest">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-[1px] border-outline-variant/30 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border-[1px] border-outline-variant/20 rounded-full"></div>
            </div>
            <div className="relative z-10 text-center px-margin-mobile">
              <span className="font-label-caps text-label-caps text-primary tracking-[0.3em] block mb-stack-md">PERFORMANCE PROTOCOL V4.2</span>
              <h1 className="font-headline-xl text-[48px] md:text-[84px] leading-none font-black italic tracking-tighter mb-stack-lg text-on-surface">READY FOR<br />THE EDGE?</h1>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/pricing" className="bg-primary text-on-primary px-8 py-4 font-label-caps text-label-caps rounded-lg hover:bg-primary-container transition-all scale-100 active:scale-95 duration-150">
                  INITIATE TRAJECTORY
                </Link>
                <button 
                  onClick={() => document.getElementById('telemetry')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border border-outline-variant text-on-surface px-8 py-4 font-label-caps text-label-caps rounded-lg hover:bg-surface-container-high transition-all"
                >
                  SYSTEM AUDIT
                </button>
              </div>
            </div>
          </section>

          {/* Elite Performance System Section */}
          <section className="py-stack-lg px-margin-mobile md:px-margin-desktop bg-surface">
            <div className="mb-stack-lg">
              <h2 className="font-headline-lg text-headline-lg font-bold tracking-tight">Elite Performance System</h2>
              <p className="font-body-lg text-body-lg text-outline max-w-2xl mt-4">Integrated management modules designed for high-density decision making and physiological peak performance.</p>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Wealth Orbit */}
              <Link href="/finance" className="md:col-span-2 bg-surface-container-low p-stack-lg rounded-xl flex flex-col justify-between group overflow-hidden relative border border-outline-variant/30 hover:border-primary transition-all duration-300">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <span className="material-symbols-outlined text-primary mb-2 block">account_balance_wallet</span>
                      <h3 className="font-headline-md text-headline-md font-bold">Wealth Orbit</h3>
                      <p className="text-outline text-body-sm">Aggregated capital trajectories and liquidity flow.</p>
                    </div>
                    <div className="text-right">
                      <div className="text-primary font-data-display text-[24px]">
                        {financeData?.netSavings !== undefined ? `₹${financeData.netSavings.toLocaleString()}` : '₹0.00'}
                      </div>
                      <div className="text-[10px] text-outline font-label-caps">NET MONTHLY SAVINGS</div>
                    </div>
                  </div>
                  <div className="h-40 w-full mt-4 -ml-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={yearlyFinanceData || []}>
                        <defs>
                          <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                          itemStyle={{ color: '#4ade80' }}
                        />
                        <Area type="monotone" dataKey="netSavings" stroke="#4ade80" fillOpacity={1} fill="url(#colorSavings)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Link>

              {/* Trajectory Flow */}
              <Link href="/schedule" className="bg-surface-container-low p-stack-lg rounded-xl flex flex-col justify-between border border-outline-variant/30 hover:border-primary transition-all duration-300">
                <div>
                  <span className="material-symbols-outlined text-tertiary mb-2 block">timeline</span>
                  <h3 className="font-headline-md text-headline-md font-bold">Trajectory Flow</h3>
                  <p className="text-outline text-body-sm mt-2">Temporal optimization and milestone velocity.</p>
                </div>
                <div className="mt-8 space-y-4">
                  <div className="bg-surface-container-high p-4 rounded-lg">
                    <div className="flex justify-between text-[10px] font-label-caps text-outline mb-1">
                      <span>TODAY EVENTS</span>
                      <span>{eventsData?.length || 0}</span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                      <div className="bg-tertiary h-full w-[40%]"></div>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
                    <div className="text-[10px] font-label-caps text-on-surface">CALENDAR LINKED</div>
                  </div>
                </div>
              </Link>

              {/* Physical Vitality */}
              <Link href="/health" className="bg-surface-container-low p-stack-lg rounded-xl flex flex-col justify-between border border-outline-variant/30 hover:border-primary transition-all duration-300">
                <div>
                  <span className="material-symbols-outlined text-on-secondary-container mb-2 block">bolt</span>
                  <h3 className="font-headline-md text-headline-md font-bold">Physical Vitality</h3>
                  <p className="text-outline text-body-sm mt-2">Biometric sync and CNS recovery metrics.</p>
                </div>
                <div className="mt-12 flex items-center justify-center">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle className="text-surface-container-highest" cx="64" cy="64" fill="transparent" r="60" stroke="currentColor" strokeWidth="4"></circle>
                      <circle className="text-primary" cx="64" cy="64" fill="transparent" r="60" stroke="currentColor" strokeDasharray="377" strokeDashoffset={healthData?.totalCalories ? Math.max(0, 377 - (healthData.totalCalories / 2000) * 377) : 377} strokeWidth="4"></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-data-display text-headline-md">{healthData?.totalCalories || 0}</span>
                      <span className="text-[8px] font-label-caps text-outline">KCAL CONSUMED</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Data Visualization - Telemetry Card */}
              <div id="telemetry" className="md:col-span-2 bg-surface-container-low p-stack-lg rounded-xl overflow-hidden relative border border-outline-variant/30 scroll-mt-24">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="font-headline-md text-headline-md font-bold">Real-time Telemetry</h3>
                    <p className="text-outline text-body-sm">Active system monitoring across all nodes.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-surface-container-high px-2 py-1 rounded text-[10px] font-label-caps text-primary animate-pulse">LIVE</span>
                    <span className="bg-error-container/20 text-error px-2 py-1 rounded text-[10px] font-label-caps">SECURE</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border border-outline-variant rounded-lg bg-surface">
                    <div className="text-outline font-label-caps text-[10px]">CPU CORE</div>
                    <div className="text-headline-md font-data-display mt-1 text-on-surface">{telemetry.cpu}%</div>
                  </div>
                  <div className="p-4 border border-outline-variant rounded-lg bg-surface">
                    <div className="text-outline font-label-caps text-[10px]">LATENCY</div>
                    <div className="text-headline-md font-data-display mt-1 text-on-surface">{telemetry.latency}ms</div>
                  </div>
                  <div className="p-4 border border-outline-variant rounded-lg bg-surface">
                    <div className="text-outline font-label-caps text-[10px]">NODES</div>
                    <div className="text-headline-md font-data-display mt-1 text-on-surface">{telemetry.nodes}</div>
                  </div>
                  <div className="p-4 border border-outline-variant rounded-lg bg-surface">
                    <div className="text-outline font-label-caps text-[10px]">UPTIME</div>
                    <div className="text-headline-md font-data-display mt-1 text-on-surface">{telemetry.uptime}%</div>
                  </div>
                </div>
                <div className="mt-8">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <div className="text-[10px] font-label-caps text-outline mb-1 uppercase tracking-wider">Active Hours Analysis</div>
                      <div className="text-body-sm text-on-surface-variant text-xs">A visual track of your daily interactions and activity intensity.</div>
                    </div>
                    <div className="text-[10px] font-label-caps text-primary">24 HOUR</div>
                  </div>
                  <div className="h-48 w-full mt-4 -ml-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData}>
                        <defs>
                          <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="var(--color-outline)" fontSize={10} tickLine={false} axisLine={false} minTickGap={20} />
                        <YAxis stroke="var(--color-outline)" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--color-surface-container)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px', fontSize: '12px' }}
                          itemStyle={{ color: 'var(--color-primary)' }}
                          formatter={(value) => [`${value} actions`, 'Intensity']}
                        />
                        <Area type="monotone" dataKey="activity" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Dynamic Action Row */}
          <section className="py-stack-lg px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
            <div className="flex flex-col md:flex-row items-center justify-between gap-stack-lg p-stack-lg border border-outline-variant rounded-2xl bg-surface">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-4xl">rocket_launch</span>
                </div>
                <div>
                  <h4 className="font-headline-md text-headline-md text-on-surface">Expand Your Reach</h4>
                  <p className="text-outline text-body-sm">Ready to scale your performance metrics to global levels?</p>
                </div>
              </div>
              <Link href="/pricing" className="bg-primary text-on-primary px-8 py-4 font-label-caps text-label-caps rounded-lg hover:brightness-110 transition-all text-center w-full md:w-auto">
                UPGRADE TO ELITE+
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="flex flex-col md:flex-row justify-between items-center w-full pl-0 md:pl-72 pr-6 md:pr-margin-desktop py-stack-lg border-t border-outline-variant bg-surface-container-lowest dark:bg-black">
            <div className="mb-stack-md md:mb-0">
              <div className="font-label-caps text-label-caps font-bold text-outline">LUMINA EDGE VELOCITY</div>
              <div className="text-body-sm text-outline opacity-50 mt-1">© 2026 Lumina Edge Velocity. All Rights Reserved.</div>
            </div>
            <div className="flex gap-stack-md flex-wrap justify-center">
              <a className="font-label-caps text-label-caps text-outline dark:text-on-tertiary-fixed-variant hover:text-primary transition-opacity duration-300" href="#">Legal</a>
              <a className="font-label-caps text-label-caps text-outline dark:text-on-tertiary-fixed-variant hover:text-primary transition-opacity duration-300" href="#">Support</a>
              <a className="font-label-caps text-label-caps text-outline dark:text-on-tertiary-fixed-variant hover:text-primary transition-opacity duration-300" href="#">Privacy Policy</a>
              <a className="font-label-caps text-label-caps text-outline dark:text-on-tertiary-fixed-variant hover:text-primary transition-opacity duration-300" href="#">Terms of Service</a>
            </div>
          </footer>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface-container-low border-t border-outline-variant flex md:hidden items-center justify-around px-4 z-50">
          <Link href="/finance" className="flex flex-col items-center text-outline hover:text-primary">
            <span className="material-symbols-outlined">payments</span>
            <span className="text-[10px] font-label-caps">Finance</span>
          </Link>
          <Link href="/schedule" className="flex flex-col items-center text-outline hover:text-primary">
            <span className="material-symbols-outlined">schedule</span>
            <span className="text-[10px] font-label-caps">Time</span>
          </Link>
          <Link href="/health" className="flex flex-col items-center text-outline hover:text-primary">
            <span className="material-symbols-outlined">monitoring</span>
            <span className="text-[10px] font-label-caps">Health</span>
          </Link>
          <Link href="/" className="flex flex-col items-center text-outline hover:text-primary">
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] font-label-caps">Profile</span>
          </Link>
        </nav>
      </div>
    </TrialGuard>
  );
}
