"use client";

import Sidebar from '@/components/Sidebar';
import { useSidebar } from '@/context/SidebarContext';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function PricingPage() {
  const { isCollapsed } = useSidebar();
  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* Sidebar Navigation Shell */}
      <Sidebar />

      {/* Main Content Shell */}
      <main className={`ml-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} min-h-screen flex flex-col transition-all duration-300`}>
        {/* Top App Bar */}
        <header className="flex justify-between items-center w-full pl-8 pr-margin-desktop py-stack-md sticky top-0 bg-surface dark:bg-surface-dim z-30">
          <div className="flex items-center gap-stack-md">
            <Link href="/" className="font-headline-md text-headline-md font-black italic text-on-surface hover:text-primary transition-colors">
              Lumina Edge
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <input className="bg-surface-container-low border border-outline-variant rounded px-4 py-2 text-body-sm focus:ring-0 focus:border-primary transition-all w-64 text-on-surface" placeholder="Search Metrics..." type="text" />
            </div>
            <div className="flex items-center gap-stack-md">
              <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all">notifications</button>
              <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all">settings</button>
              <div className="ml-2 flex items-center justify-center">
                <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Canvas */}
        <div className="flex-1 p-8 md:p-margin-desktop">
          <div className="max-w-6xl mx-auto">
            {/* Headline Section */}
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tighter">CHOOSE YOUR MOMENTUM</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto font-body-lg text-body-lg">
                Select a Tier engineered for precision. No noise, just elite performance metrics for the disciplined mind.
              </p>
            </div>

            {/* Pricing Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-stretch">

              {/* Solo Sprint Tier */}
              <div className="flex flex-col p-stack-lg rounded-xl bg-surface-container-low border border-outline-variant/30 hover:border-outline-variant transition-all duration-300 group">
                <div className="mb-stack-lg">
                  <span className="font-label-caps text-label-caps text-primary tracking-widest">INDIVIDUAL</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-2">Solo Sprint</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-headline-lg font-bold text-on-surface">₹120</span>
                  <span className="text-outline font-label-caps">/month</span>
                </div>
                <ul className="flex-1 space-y-4 mb-stack-lg">
                  <li className="flex items-center gap-3 text-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                    Core Performance Hub
                  </li>
                  <li className="flex items-center gap-3 text-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                    3D Visualization
                  </li>
                  <li className="flex items-center gap-3 text-body-md text-outline opacity-50">
                    <span className="material-symbols-outlined text-xl">remove_circle_outline</span>
                    Advanced Analytics
                  </li>
                </ul>
                <Link href="/checkout?plan=solo" className="w-full py-4 rounded font-label-caps text-label-caps bg-surface-container-highest text-on-surface hover:bg-surface-container-high transition-colors border border-outline-variant text-center font-bold">
                  INITIATE START
                </Link>
              </div>

              {/* Elite Core (Best Value) */}
              <div className="flex flex-col p-stack-lg rounded-xl bg-surface-container border-2 border-primary relative shadow-2xl scale-105 z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-[10px] font-bold tracking-widest">
                  BEST VALUE
                </div>
                <div className="mb-stack-lg">
                  <span className="font-label-caps text-label-caps text-primary tracking-widest">PROFESSIONAL</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-2">Elite Core</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-headline-lg font-black text-on-surface">₹250</span>
                  <span className="text-outline font-label-caps">/quarter</span>
                </div>
                <ul className="flex-1 space-y-4 mb-stack-lg">
                  <li className="flex items-center gap-3 text-body-md text-on-surface">
                    <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    3D Visualization
                  </li>
                  <li className="flex items-center gap-3 text-body-md text-on-surface">
                    <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Advanced Analytics
                  </li>
                  <li className="flex items-center gap-3 text-body-md text-on-surface">
                    <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Real-time Synchronization
                  </li>
                </ul>
                <Link href="/checkout?plan=elite" className="w-full py-4 rounded font-label-caps text-label-caps bg-primary text-on-primary hover:brightness-110 transition-all font-bold text-center">
                  UPGRADE NOW
                </Link>
              </div>

              {/* Momentum Max Tier */}
              <div className="flex flex-col p-stack-lg rounded-xl bg-surface-container-low border border-outline-variant/30 hover:border-outline-variant transition-all duration-300 group">
                <div className="mb-stack-lg">
                  <span className="font-label-caps text-label-caps text-primary tracking-widest">ULTIMATE</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-2">Momentum Max</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-headline-lg font-bold text-on-surface">₹1,320</span>
                  <span className="text-outline font-label-caps">/year</span>
                </div>
                <ul className="flex-1 space-y-4 mb-stack-lg">
                  <li className="flex items-center gap-3 text-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                    Advanced Analytics
                  </li>
                  <li className="flex items-center gap-3 text-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                    Unlimited Modules
                  </li>
                  <li className="flex items-center gap-3 text-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                    Priority Developer Access
                  </li>
                </ul>
                <Link href="/checkout?plan=max" className="w-full py-4 rounded font-label-caps text-label-caps bg-surface-container-highest text-on-surface hover:bg-surface-container-high transition-colors border border-outline-variant text-center font-bold">
                  GO UNLIMITED
                </Link>
              </div>
            </div>

            {/* Feature Comparison Teaser */}
            <div className="mt-20 p-stack-lg bg-surface-container-low rounded-xl border border-outline-variant/20 overflow-hidden relative">
              <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-primary via-transparent to-transparent"></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-gutter">
                <div className="space-y-2 text-center md:text-left">
                  <h4 className="font-headline-md text-headline-md text-on-surface">Enterprise Precision</h4>
                  <p className="text-on-surface-variant text-body-md">Need a customized architecture for your entire team? Lumina Edge Enterprise scales to your velocity.</p>
                </div>
                <button className="whitespace-nowrap px-8 py-3 rounded border border-primary text-primary font-label-caps text-label-caps hover:bg-primary/10 transition-all">
                  CONTACT ADVISOR
                </button>
              </div>
            </div>

            {/* Atmospheric Visual Placeholder */}
            <div className="mt-gutter rounded-xl h-64 overflow-hidden relative">
              <img className="w-full h-full object-cover grayscale opacity-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjixwq5xdhDCpHmIX_28JhKy55fFILrGkK5AtNWoqJ01314ylT097TBlJ-_NiyMV0wvWWEaOuC6xJChw195lnEB6Jqwt4CtCq4q8jtpsPZZLg9vR-EA5j25ahSw0xbdabdOgthNP1PrnIo7S_fULG6t7SX3fdDSmiNdE7tx3F24M3j59OaoOAT33ngRFzcQXDhaxxT4rF0nLpZZXTIqUxa3uhRAqEY_yTjorz96wmqPs2xxgIIt3uuetX12FVWvwXlf28ynjVXwJM" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Footer Shell */}
        <footer className="flex flex-row justify-between items-center w-full pl-8 pr-margin-desktop py-stack-lg border-t border-outline-variant bg-surface-container-lowest dark:bg-black mt-auto">
          <div className="flex flex-col gap-2">
            <div className="font-label-caps text-label-caps font-bold text-outline">LUMINA EDGE VELOCITY</div>
            <p className="font-body-sm text-body-sm text-outline dark:text-on-tertiary-fixed-variant">© 2026 Lumina Edge Velocity. All Rights Reserved.</p>
          </div>
          <nav className="flex gap-8">
            <a className="font-label-caps text-label-caps text-outline dark:text-on-tertiary-fixed-variant hover:text-primary transition-opacity duration-300" href="#">Legal</a>
            <a className="font-label-caps text-label-caps text-outline dark:text-on-tertiary-fixed-variant hover:text-primary transition-opacity duration-300" href="#">Support</a>
            <a className="font-label-caps text-label-caps text-outline dark:text-on-tertiary-fixed-variant hover:text-primary transition-opacity duration-300" href="#">Privacy Policy</a>
            <a className="font-label-caps text-label-caps text-outline dark:text-on-tertiary-fixed-variant hover:text-primary transition-opacity duration-300" href="#">Terms of Service</a>
          </nav>
        </footer>
      </main>
    </div>
  );
}
