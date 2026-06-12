"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser, SignInButton } from '@clerk/nextjs';
import GlobalActions from './GlobalActions';
import { useSidebar } from '@/context/SidebarContext';
import ProtectedLink from './ProtectedLink';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isLoaded, isSignedIn } = useUser();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [showFeedback, setShowFeedback] = useState(false);

  // Define admin check (Can be set via Clerk Public Metadata or Environment Variable)
  const isAdmin = user?.primaryEmailAddress?.emailAddress === 'jaiprakashray747@gmail.com';

  const navItems = [
    { name: 'Overview', href: '/', icon: 'dashboard' },
    { name: 'Finance', href: '/finance', icon: 'payments' },
    { name: 'Time', href: '/schedule', icon: 'schedule' },
    { name: 'Health', href: '/health', icon: 'monitoring' },
    { name: 'Canvas', href: '/canvas', icon: 'edit_note' },
    ...(isAdmin ? [{ name: 'Admin Panel', href: '/admin', icon: 'admin_panel_settings' }] : []),
    { name: 'Pricing', href: '/pricing', icon: 'sell' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed bottom-6 right-6 z-[60] bg-primary text-on-primary rounded-full p-4 shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
      >
        <span className="material-symbols-outlined">{isCollapsed ? 'menu' : 'close'}</span>
      </button>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`h-screen left-0 top-0 fixed flex flex-col border-r border-outline-variant bg-surface-container-low dark:bg-surface-container-lowest z-50 transition-all duration-300 ${
        isCollapsed ? '-translate-x-full md:translate-x-0 w-20' : 'translate-x-0 w-64'
      }`}>
        <div className={`px-6 py-8 flex flex-col ${isCollapsed ? 'items-center px-2 md:items-center' : ''}`}>
        <div className="flex items-center justify-between w-full">
          {!isCollapsed ? (
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="Lumina Edge Logo" className="w-8 h-8 rounded object-cover" />
              <span className="font-headline-md text-headline-md font-bold tracking-tighter text-on-surface truncate">
                Lumina Edge
              </span>
            </Link>
          ) : (
            <div className="w-8 h-8 shrink-0 flex items-center justify-center">
              <img src="/logo.png" alt="LE" className="w-8 h-8 rounded object-cover" />
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="flex items-center justify-between mt-2">
            <div className="font-label-caps text-label-caps text-outline">Elite Status</div>
            <GlobalActions />
          </div>
        )}
      </div>
      
      {/* Collapse Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-8 bg-surface-container-high border border-outline-variant text-on-surface hover:text-primary rounded-full w-6 h-6 flex items-center justify-center shadow-md z-50 transition-colors"
      >
        <span className="material-symbols-outlined text-sm">{isCollapsed ? 'chevron_right' : 'chevron_left'}</span>
      </button>
      
      <nav className="flex-1 px-4 mt-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <ProtectedLink
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 py-3 rounded-lg font-label-caps text-label-caps transition-all group ${
                isCollapsed ? 'px-0 justify-center w-12 mx-auto relative' : 'px-4'
              } ${
                isActive
                  ? 'text-primary dark:text-primary-fixed bg-surface-container-high ' + (!isCollapsed && 'border-r-2 border-primary')
                  : 'text-on-surface-variant dark:text-outline opacity-70 hover:opacity-100 hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {!isCollapsed && <span>{item.name}</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-surface-container-highest text-on-surface text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </ProtectedLink>
          );
        })}
      </nav>

      <div className="mt-auto px-4 pb-4">
        <div className="relative">
          <button 
            onClick={() => setShowFeedback(!showFeedback)}
            className={`w-full flex items-center justify-center gap-2 py-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant rounded-lg text-on-surface-variant hover:text-on-surface transition-colors font-label-caps text-xs ${isCollapsed ? 'px-0' : 'px-4'}`}
            title="Feedback & Support"
          >
            <span className="material-symbols-outlined text-sm">bug_report</span>
            {!isCollapsed && <span>Feedback</span>}
          </button>
          
          {showFeedback && (
            <div className={`absolute bottom-full left-0 mb-2 bg-surface-container-high border border-outline-variant rounded-lg shadow-xl overflow-hidden flex flex-col z-50 ${isCollapsed ? 'w-48 -right-4 left-auto' : 'w-full'}`}>
              <a 
                href="https://github.com/SUMIT74184/Lumina-Edge/issues/new?labels=bug&title=[BUG]+%3CShort+description%3E" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setShowFeedback(false)}
                className="flex items-center gap-2 px-4 py-3 hover:bg-surface-container-highest text-sm text-error transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">pest_control</span>
                <span>Report Bug</span>
              </a>
              <a 
                href="https://github.com/SUMIT74184/Lumina-Edge/issues/new?labels=enhancement&title=[FEATURE]+%3CShort+description%3E" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setShowFeedback(false)}
                className="flex items-center gap-2 px-4 py-3 hover:bg-surface-container-highest text-sm text-primary transition-colors border-t border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                <span>Feature Suggestion</span>
              </a>
              <a 
                href="https://github.com/SUMIT74184/Lumina-Edge/issues/new?labels=help+wanted&title=[SUPPORT]+%3CShort+description%3E" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setShowFeedback(false)}
                className="flex items-center gap-2 px-4 py-3 hover:bg-surface-container-highest text-sm text-on-surface transition-colors border-t border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[16px]">support_agent</span>
                <span>Support</span>
              </a>
            </div>
          )}
        </div>
      </div>

      <div className={`p-6 border-t border-outline-variant ${isCollapsed ? 'px-2 flex justify-center' : ''}`}>
        {isLoaded ? (
          isSignedIn ? (
            <div className={`flex items-center gap-3 ${isCollapsed ? 'flex-col' : ''}`}>
              <UserButton appearance={{ elements: { userButtonAvatarBox: isCollapsed ? "w-8 h-8" : "w-10 h-10" } }} />
              {!isCollapsed && (
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface truncate max-w-[120px]">{user.fullName || user.firstName || 'USER'}</p>
                  <p className="text-[10px] text-outline uppercase">TIER 01 ANALYST</p>
                </div>
              )}
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className={`py-2 bg-primary/10 text-primary font-label-caps text-label-caps rounded-lg hover:bg-primary/20 transition-all font-bold ${isCollapsed ? 'w-10 h-10 flex items-center justify-center p-0' : 'w-full'}`}>
                {isCollapsed ? <span className="material-symbols-outlined">login</span> : 'SIGN IN'}
              </button>
            </SignInButton>
          )
        ) : (
          <div className="flex items-center gap-3 animate-pulse">
            <div className={`${isCollapsed ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-surface-container-highest shrink-0`}></div>
            {!isCollapsed && (
              <div className="space-y-2">
                <div className="h-3 w-20 bg-surface-container-highest rounded"></div>
                <div className="h-2 w-16 bg-surface-container-highest rounded"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
    </>
  );
}
